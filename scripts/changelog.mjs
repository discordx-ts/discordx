import _ from "lodash";
import child from "child_process";
import fs from "fs";
import prettier from "prettier";

function generateDoc(repo, tagMatcher, tagReplacer, folder, filepath) {
  let completeChangelog = "";

  const tags = _.compact(
    child
      .execSync(`git tag --list "${tagMatcher}"`)
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
          `git log ${tag} --format=%B----HASH----%H----DELIMITER---- ${folder}`
        )
        .toString("utf-8");
    } else if (tag === "head") {
      commits = child
        .execSync(
          `git log ${
            tags[index - 1]
          }..HEAD --format=%B----HASH----%H----DELIMITER---- ${folder}`
        )
        .toString("utf-8");
    } else {
      commits = child
        .execSync(
          `git log ${
            tags[index - 1]
          }..${tag} --format=%B----HASH----%H----DELIMITER---- ${folder}`
        )
        .toString("utf-8");
    }

    const commitsArray = commits
      .split("----DELIMITER----\n")
      .map((commit) => {
        const [message, sha] = commit.split("----HASH----");

        const title = message
          .split("\n")[0]
          ?.replaceAll(
            /#([0-9]{1,})/gm,
            `[#$1](https://github.com/${repo}/issues/$1)`
          );

        return { message: title, sha: title ? sha : undefined };
      })
      .filter((commit) => Boolean(commit.sha));

    const tagDate = child
      .execSync(`git log -1 --format=%ai ${tag}`)
      .toString("utf-8");

    const buildStore = [];
    const choreStore = [];
    const ciStore = [];
    const docsStore = [];
    const featStore = [];
    const fixStore = [];
    const refactorStore = [];
    const revertStore = [];
    const testStore = [];
    const typesStore = [];
    const workflowStore = [];
    const allStore = [];
    const breakingStore = [];

    commitsArray.forEach((commit) => {
      const formatedCommit = (replace) =>
        `* ${commit.message.replace(
          replace ? `${replace}: ` : "",
          ""
        )} ([${commit.sha.substring(0, 6)}](https://github.com/${repo}/commit/${
          commit.sha
        }))\n`;

      if (commit.message.startsWith("chore: ")) {
        choreStore.push(formatedCommit("chore"));
      } else if (commit.message.startsWith("BREAKING CHANGE: ")) {
        breakingStore.push(formatedCommit("BREAKING CHANGE"));
      } else if (commit.message.startsWith("build: ")) {
        buildStore.push(formatedCommit("build"));
      } else if (commit.message.startsWith("ci: ")) {
        ciStore.push(formatedCommit("ci"));
      } else if (commit.message.startsWith("docs: ")) {
        docsStore.push(formatedCommit("docs"));
      } else if (commit.message.startsWith("feat: ")) {
        featStore.push(formatedCommit("feat"));
      } else if (commit.message.startsWith("fix: ")) {
        fixStore.push(formatedCommit("fix"));
      } else if (commit.message.startsWith("refactor: ")) {
        refactorStore.push(formatedCommit("refactor"));
      } else if (commit.message.startsWith("test: ")) {
        testStore.push(formatedCommit("test"));
      } else if (commit.message.startsWith("revert: ")) {
        revertStore.push(formatedCommit("revert"));
      } else if (commit.message.startsWith("types: ")) {
        typesStore.push(formatedCommit("types"));
      } else if (commit.message.startsWith("workflow: ")) {
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
        : `# ${tag} (${new Date(tagDate).toISOString().split("T")[0]})\n\n`;

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
    filepath,
    `${prettier.format(completeChangelog, {
      parser: "markdown",
    })}`
  );
}

generateDoc(
  "oceanroleplay/discord.ts",
  "v*",
  undefined,
  "src",
  "./CHANGELOG.md"
);
generateDoc(
  "oceanroleplay/discord.ts",
  "v*",
  undefined,
  "docs/docs",
  "./docs/CHANGELOG.md"
);
generateDoc(
  "oceanroleplay/discord.ts",
  "m-v*",
  "m-",
  "packages/music/src",
  "./packages/music/CHANGELOG.md"
);
generateDoc(
  "oceanroleplay/discord.ts",
  "u-v*",
  "u-",
  "packages/utilities/src",
  "./packages/utilities/CHANGELOG.md"
);

console.log("Changelog generated...");
