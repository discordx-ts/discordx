import _ from "lodash";
import child from "child_process";
import fs from "fs";
import prettier from "prettier";

export function generateDoc(
  folder?: string,
  filepath?: string,
  tagMatcher?: string,
  tagReplacer?: string
): string {
  const remoteurl = child
    .execSync("git config --get remote.origin.url")
    .toString("utf-8");

  const reg = /(git@github\.com:|https:\/\/github.com\/)(.*?)\.git/gm;
  const repo = reg.exec(remoteurl)?.at(2);

  if (!repo) {
    throw Error("repository not found");
  }

  let completeChangelog = "";

  const tags = _.compact(
    child
      .execSync(`git tag --list "${tagMatcher ?? "v*"}"`)
      .toString("utf-8")
      .split("\n")
  );

  tags.push("head");

  if (!tags.length) {
    console.log("Without tags, changelogs could not be generated");
  }

  tags.forEach((tag, index) => {
    let commits;
    if (index < 1) {
      commits = child
        .execSync(
          `git log ${tag} --format=%B----HASH----%H----DELIMITER---- ${
            folder ?? "./"
          }`
        )
        .toString("utf-8");
    } else if (tag === "head") {
      commits = child
        .execSync(
          `git log ${
            tags[index - 1]
          }..HEAD --format=%B----HASH----%H----DELIMITER---- ${folder ?? "./"}`
        )
        .toString("utf-8");
    } else {
      commits = child
        .execSync(
          `git log ${
            tags[index - 1]
          }..${tag} --format=%B----HASH----%H----DELIMITER---- ${
            folder ?? "./"
          }`
        )
        .toString("utf-8");
    }

    const commitsArray = commits
      .split("----DELIMITER----\n")
      .map((commit) => {
        const [message, sha] = commit.split("----HASH----");

        const title = message
          ?.split("\n")[0]
          ?.replaceAll(
            /#([0-9]{1,})/gm,
            `[#$1](https://github.com/${repo}/issues/$1)`
          );

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

    const buildStore: string[] = [];
    const choreStore: string[] = [];
    const ciStore: string[] = [];
    const docsStore: string[] = [];
    const featStore: string[] = [];
    const fixStore: string[] = [];
    const refactorStore: string[] = [];
    const revertStore: string[] = [];
    const testStore: string[] = [];
    const typesStore: string[] = [];
    const workflowStore: string[] = [];
    const allStore: string[] = [];
    const breakingStore: string[] = [];

    commitsArray.forEach((commit) => {
      const formatedCommit = (replace?: string) =>
        `* ${commit.title.replace(
          replace ? `${replace}: ` : "",
          ""
        )} ([${commit.sha.substring(0, 6)}](https://github.com/${repo}/commit/${
          commit.sha
        }))\n`;

      if (commit.title.startsWith("chore: ")) {
        choreStore.push(formatedCommit("chore"));
      } else if (commit.title.startsWith("BREAKING CHANGE: ")) {
        breakingStore.push(formatedCommit("BREAKING CHANGE"));
      } else if (commit.title.startsWith("build: ")) {
        buildStore.push(formatedCommit("build"));
      } else if (commit.title.startsWith("ci: ")) {
        ciStore.push(formatedCommit("ci"));
      } else if (commit.title.startsWith("docs: ")) {
        docsStore.push(formatedCommit("docs"));
      } else if (commit.title.startsWith("feat: ")) {
        featStore.push(formatedCommit("feat"));
      } else if (commit.title.startsWith("fix: ")) {
        if (commit.message.includes("BREAKING CHANGE")) {
          breakingStore.push(formatedCommit("fix"));
        } else {
          fixStore.push(formatedCommit("fix"));
        }
      } else if (commit.title.startsWith("refactor: ")) {
        if (commit.message.includes("BREAKING CHANGE")) {
          breakingStore.push(formatedCommit("refactor"));
        } else {
          refactorStore.push(formatedCommit("refactor"));
        }
      } else if (commit.title.startsWith("test: ")) {
        testStore.push(formatedCommit("test"));
      } else if (commit.title.startsWith("revert: ")) {
        revertStore.push(formatedCommit("revert"));
      } else if (commit.title.startsWith("types: ")) {
        typesStore.push(formatedCommit("types"));
      } else if (commit.title.startsWith("workflow: ")) {
        workflowStore.push(formatedCommit("workflow"));
      } else {
        allStore.push(formatedCommit());
      }
    });

    if (!commitsArray.length) {
      return;
    }

    let newChangelog =
      tag === "head"
        ? "# Stage\n\n"
        : `# [${tag}](https://github.com/${repo}/releases/tag/${tag}) (${
            new Date(tagDate).toISOString().split("T")[0]
          })\n\n`;

    if (tagReplacer) {
      newChangelog = newChangelog.replace(tagReplacer, "");
    }

    if (breakingStore.length) {
      newChangelog += "## BREAKING CHANGES\n";
      breakingStore.forEach((cm) => {
        newChangelog += cm;
      });
      newChangelog += "\n";
    }

    if (featStore.length) {
      newChangelog += "## Features\n";
      featStore.forEach((cm) => {
        newChangelog += cm;
      });
      newChangelog += "\n";
    }

    if (refactorStore.length) {
      newChangelog += "## Changed\n";
      refactorStore.forEach((cm) => {
        newChangelog += cm;
      });
      newChangelog += "\n";
    }

    if (fixStore.length) {
      newChangelog += "## Fixed\n";
      fixStore.forEach((cm) => {
        newChangelog += cm;
      });
      newChangelog += "\n";
    }

    if (revertStore.length) {
      newChangelog += "## Reverts\n";
      revertStore.forEach((cm) => {
        newChangelog += cm;
      });
      newChangelog += "\n";
    }

    if (testStore.length) {
      newChangelog += "## Tests\n";
      testStore.forEach((cm) => {
        newChangelog += cm;
      });
      newChangelog += "\n";
    }

    if (buildStore.length) {
      newChangelog += "## Build\n";
      buildStore.forEach((cm) => {
        newChangelog += cm;
      });
      newChangelog += "\n";
    }

    if (typesStore.length) {
      newChangelog += "## Types\n";
      typesStore.forEach((cm) => {
        newChangelog += cm;
      });
      newChangelog += "\n";
    }

    if (docsStore.length) {
      newChangelog += "## Documenations\n";
      docsStore.forEach((cm) => {
        newChangelog += cm;
      });
      newChangelog += "\n";
    }

    if (choreStore.length) {
      newChangelog += "## Routine Tasks\n";
      choreStore.forEach((cm) => {
        newChangelog += cm;
      });
      newChangelog += "\n";
    }

    if (ciStore.length || workflowStore.length) {
      newChangelog += "## CI\n";
      ciStore.forEach((cm) => {
        newChangelog += cm;
      });
      workflowStore.forEach((cm) => {
        newChangelog += cm;
      });
      newChangelog += "\n";
    }

    if (allStore.length) {
      newChangelog += "## Untagged\n";
      allStore.forEach((cm) => {
        newChangelog += cm;
      });
      newChangelog += "\n";
    }

    newChangelog += "\n";
    completeChangelog = newChangelog + completeChangelog;
  });

  fs.writeFileSync(
    filepath ?? "./CHANGELOG.md",
    `${prettier.format(completeChangelog, {
      parser: "markdown",
    })}`
  );

  return repo;
}
