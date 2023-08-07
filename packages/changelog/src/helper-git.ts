import child from "child_process";

export function GetRepoUrl(): string {
  let remoteUrl = child
    .execSync("git config --get remote.origin.url")
    .toString("utf-8")
    .trim();

  if (!remoteUrl.length) {
    throw Error(
      "repo not found, make sure to run the command in the git directory only",
    );
  }

  if (!remoteUrl.endsWith(".git")) {
    remoteUrl += ".git";
  }

  if (RegExp(/.*@.*:.*.git/gm).test(remoteUrl)) {
    const regExp = RegExp(/.*@(.*?):(.*?).git/gm).exec(remoteUrl);
    if (!regExp) {
      throw Error("Invalid repo url passed");
    }

    const domain = regExp.at(1);
    const subUrl = regExp.at(2);

    return `https://${domain ?? ""}/${subUrl ?? ""}`;
  }

  return remoteUrl.substring(0, remoteUrl.length - 4);
}
