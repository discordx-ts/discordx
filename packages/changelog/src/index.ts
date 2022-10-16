import fs from "fs";
import prettier from "prettier";

import { GetCommits } from "./helper-commits.js";
import { GetRepoUrl } from "./helper-git.js";
import { GetTagDate, GetTags } from "./helper-tag.js";
import { CommitCategories } from "./metadata.js";

type Options = {
  matchTag: string; // "v*"
  onlyStage: boolean;
  out: string; // "./CHANGELOG.md"
  replaceTag?: string;
  src: string; // "./"
};

export function GenerateChangelog(config: Options): {
  content: string;
  repo: string;
} {
  const repo = GetRepoUrl();
  let content = "";

  const allTags = GetTags(config.matchTag);

  allTags.forEach((tag, index) => {
    const tagDate = GetTagDate(tag);
    const commits = GetCommits({
      from: allTags[index - 1] ?? tag,
      path: config.src,
      repo: repo,
      to: tag,
    });

    if (!commits.length) {
      return;
    }

    let changelog =
      tag === "HEAD"
        ? ""
        : `# [${tag}](${repo}/releases/tag/${tag}) (${
            new Date(tagDate).toISOString().split("T")[0] ?? ""
          })\n\n`;

    if (config.replaceTag) {
      changelog = changelog.replace(config.replaceTag, "");
    }

    CommitCategories.forEach((cat) => {
      const items = commits.filter((r) => cat.types.includes(r.type));

      if (items.length) {
        changelog += `## ${cat.title}\n`;
        items.forEach((cm) => {
          changelog += cm.title;
        });

        changelog += "\n";
      }
    });

    changelog += "\n";

    if (config.onlyStage) {
      content = changelog;
    } else {
      content = changelog + content;
    }
  });

  fs.writeFileSync(
    config.out,
    `${prettier.format(content, {
      parser: "markdown",
    })}`
  );

  return { content, repo };
}
