import { execSync } from "child_process";
import path from "path";
import rimraf from "rimraf";

function isInGitRepository(root: string): boolean {
  try {
    execSync("git rev-parse --is-inside-work-tree", {
      cwd: root,
      stdio: "ignore",
    });
    return true;
  } catch (_) {}
  return false;
}

function isInMercurialRepository(root: string): boolean {
  try {
    execSync("hg --cwd . root", { cwd: root, stdio: "ignore" });
    return true;
  } catch (_) {}
  return false;
}

export function tryGitInit(root: string): boolean {
  let didInit = false;
  try {
    execSync("git --version", { cwd: root, stdio: "ignore" });
    if (isInGitRepository(root) || isInMercurialRepository(root)) {
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
  } catch (e) {
    if (didInit) {
      try {
        rimraf.sync(path.join(root, ".git"));
      } catch (_) {
        // empty statement
      }
    }

    return false;
  }
}
