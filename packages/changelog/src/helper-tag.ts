/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import child from "child_process";
import compact from "lodash/compact.js";

export function GetTags(match: string): string[] {
  const tags = compact(
    child
      .execSync(`git tag --list --sort=v:refname "${match}"`)
      .toString("utf-8")
      .split("\n"),
  );

  tags.push("HEAD");
  return tags;
}

export function GetTagDate(tag: string): string {
  const createdAt = child
    .execSync(`git log -1 --format=%ai ${tag === "HEAD" ? "" : tag}`)
    .toString("utf-8");

  return createdAt;
}
