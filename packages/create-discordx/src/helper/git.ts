/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { execSync } from "node:child_process";
import path from "node:path";
import { rimraf } from "rimraf";

function IsInGitRepository(root: string): boolean {
  try {
    execSync("git rev-parse --is-inside-work-tree", {
      cwd: root,
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}

function IsInMercurialRepository(root: string): boolean {
  try {
    execSync("hg --cwd . root", { cwd: root, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export function TryGitInit(root: string): boolean {
  let didInit = false;
  try {
    execSync("git --version", { cwd: root, stdio: "ignore" });
    if (IsInGitRepository(root) || IsInMercurialRepository(root)) {
      return false;
    }

    execSync("git init", { cwd: root, stdio: "ignore" });
    didInit = true;

    execSync("git checkout -b main", { cwd: root, stdio: "ignore" });
    execSync("git add -A", { cwd: root, stdio: "ignore" });
    execSync('git commit -m "Initial commit from discordx"', {
      cwd: root,
      stdio: "ignore",
    });

    return true;
  } catch {
    if (didInit) {
      try {
        rimraf.sync(path.join(root, ".git"));
      } catch {
        // empty statement
      }
    }

    return false;
  }
}
