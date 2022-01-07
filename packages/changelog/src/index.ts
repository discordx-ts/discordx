import _ from "lodash";
import child from "child_process";
import fs from "fs";
import prettier from "prettier";

export type storeType =
  | "build"
  | "chore"
  | "ci"
  | "docs"
  | "feat"
  | "fix"
  | "refactor"
  | "revert"
  | "test"
  | "types"
  | "workflow"
  | "untagged"
  | "BREAKING CHANGE";

const categories: {
  breaking: boolean;
  storeTypes: storeType[];
  title: string;
}[] = [
  {
    breaking: false,
    storeTypes: ["BREAKING CHANGE"],
    title: "Breaking Changes",
  },
  { breaking: false, storeTypes: ["feat"], title: "Features" },
  { breaking: true, storeTypes: ["refactor"], title: "Changed" },
  { breaking: true, storeTypes: ["fix"], title: "Fixed" },
  { breaking: false, storeTypes: ["revert"], title: "Reverts" },
  { breaking: false, storeTypes: ["test"], title: "Tests" },
  { breaking: false, storeTypes: ["build"], title: "Build" },
  { breaking: false, storeTypes: ["types"], title: "Types" },
  { breaking: false, storeTypes: ["docs"], title: "Documenations" },
  { breaking: false, storeTypes: ["chore"], title: "Routine Tasks" },
  { breaking: false, storeTypes: ["ci", "workflow"], title: "CI" },
  { breaking: false, storeTypes: ["untagged"], title: "Untagged" },
];

export function getRepoUrl(): string {
  let remoteurl = child
    .execSync("git config --get remote.origin.url")
    .toString("utf-8")
    .trim();

  if (!remoteurl.length) {
    throw Error(
      "repo not found, make sure to run the command in the git directory only"
    );
  }

  if (!remoteurl.endsWith(".git")) {
    remoteurl += ".git";
  }

  if (RegExp(/.*@.*:.*.git/gm).test(remoteurl)) {
    const r = RegExp(/.*@(.*?):(.*?).git/gm).exec(remoteurl);
    if (!r) {
      throw Error("Invalid repo url passed");
    }

    const domain = r.at(1);
    const subUrl = r.at(2);

    return `https://${domain}/${subUrl}`;
  }

  return remoteurl.substring(0, remoteurl.length - 4);
}

export function generateDoc(
  folder?: string,
  filepath?: string,
  tagMatcher?: string,
  tagReplacer?: string,
  ignoreScopeArg?: string[]
): string {
  const ignoreScopes: string[] = ignoreScopeArg ? ignoreScopeArg : [];
  const repo = getRepoUrl();

  let completeChangelog = "";

  const tags = _.compact(
    child
      .execSync(`git tag --list "${tagMatcher ?? "v*"}"`)
      .toString("utf-8")
      .split("\n")
  );

  tags.push("head");

  if (!tags.length) {
    throw Error("Without tags, changelogs could not be generated");
  }

  tags.forEach((tag, index) => {
    const tagString =
      index < 1
        ? tag
        : tag === "head"
        ? `${tags[index - 1]}..HEAD`
        : `${tags[index - 1]}..${tag}`;

    const commitsArray = child
      .execSync(
        `git log ${tagString} --format=%B----HASH----%H----DELIMITER---- ${
          folder ?? "./"
        }`
      )
      .toString("utf-8")
      .split("----DELIMITER----\n")
      .map((commit) => {
        const [message, sha] = commit.split("----HASH----");

        const title = message
          ?.split("\n")[0]
          ?.replaceAll(/#([0-9]{1,})/gm, `[#$1](${repo}/issues/$1)`);

        return {
          message: message as string,
          sha: (title ? sha : undefined) as string,
          title: title as string,
        };
      })
      .filter((commit) => Boolean(commit.title) && Boolean(commit.sha));

    const tagDate = child
      .execSync(`git log -1 --format=%ai ${tag}`)
      .toString("utf-8");

    const store: { text: string; type: storeType }[] = [];

    commitsArray.forEach((commit) => {
      const formatedCommit = (replace?: string) =>
        `* ${commit.title.replace(
          replace ? `${replace}: ` : "",
          ""
        )} ([${commit.sha.substring(0, 6)}](${repo}/commit/${commit.sha}))\n`;

      let isPushed = false;
      categories.forEach((cat) => {
        cat.storeTypes.forEach((st) => {
          if (commit.title.startsWith(`${st}: `)) {
            store.push({
              text: formatedCommit(st),
              type: commit.message.includes("BREAKING CHANGE")
                ? "BREAKING CHANGE"
                : st,
            });
            isPushed = true;
          }
        });
      });

      if (!isPushed) {
        store.push({ text: formatedCommit(), type: "untagged" });
      }
    });

    let finalChangeLog =
      tag === "head"
        ? "# Stage\n\n"
        : `# [${tag}](${repo}/releases/tag/${tag}) (${
            new Date(tagDate).toISOString().split("T")[0]
          })\n\n`;

    if (tagReplacer) {
      finalChangeLog = finalChangeLog.replace(tagReplacer, "");
    }

    categories.forEach((cat) => {
      const items = store.filter(
        (r) => cat.storeTypes.includes(r.type) && !ignoreScopes.includes(r.type)
      );
      if (items.length) {
        finalChangeLog += `## ${cat.title}\n`;
        items.forEach((cm) => {
          finalChangeLog += cm.text;
        });
        finalChangeLog += "\n";
      }
    });

    finalChangeLog += "\n";
    completeChangelog = finalChangeLog + completeChangelog;
  });

  fs.writeFileSync(
    filepath ?? "./CHANGELOG.md",
    `${prettier.format(completeChangelog, {
      parser: "markdown",
    })}`
  );

  return repo;
}
