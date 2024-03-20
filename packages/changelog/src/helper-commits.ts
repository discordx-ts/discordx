/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import child from "child_process";

import type { CommitType } from "./metadata.js";
import { CommitCategories } from "./metadata.js";

export type Commit = {
  message: string;
  sha: string;
  title: string;
  type: CommitType;
};

function FormatTitle(options: {
  replacement?: CommitType;
  repo: string;
  sha: string;
  title: string;
}) {
  return `* ${options.title.replace(
    !options.replacement
      ? ""
      : new RegExp(`${options.replacement}\\(.*\\): |${options.replacement}: `),
    "",
  )} ([${options.sha.substring(0, 6)}](${options.repo}/commit/${
    options.sha
  }))\n`;
}

export function GetCommits(config: {
  from: string;
  path: string;
  repo: string;
  to: string;
}): Commit[] {
  const tagDiff =
    config.from === config.to
      ? config.to
      : `${config.from}..${config.to === "HEAD" ? "" : config.to}`;

  const commits = child
    .execSync(
      `git log ${tagDiff} --format=%B----SEPARATOR----%H----DELIMITER---- ${config.path}`,
    )
    .toString("utf-8")
    .split("----DELIMITER----\n")
    .map((commit): Commit | null => {
      const [message, sha] = commit.split("----SEPARATOR----");

      const title = message
        ?.split("\n")[0]
        ?.replaceAll(/#([0-9]{1,})/gm, `[#$1](${config.repo}/issues/$1)`);

      if (!message || !sha || !title) {
        return null;
      }

      const category = CommitCategories.find((cat) =>
        cat.types.some((subType) =>
          new RegExp(`${subType}\\(.*\\): |${subType}: `).test(title),
        ),
      );

      const type = category?.types.find((subType) =>
        new RegExp(`${subType}\\(.*\\): |${subType}: `).test(title),
      );

      return {
        message: message,
        sha: sha,
        title: FormatTitle({
          replacement: type,
          repo: config.repo,
          sha: sha,
          title: title,
        }),
        type:
          category?.breaking && message.includes("BREAKING CHANGE")
            ? "BREAKING CHANGE"
            : type ?? "untagged",
      };
    })
    .filter((tag): tag is Commit => tag !== null);

  return commits;
}
