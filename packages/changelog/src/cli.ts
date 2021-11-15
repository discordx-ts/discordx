#! /usr/bin/env node
import { generateDoc } from "./index.js";

function getArg(name: string) {
  const find = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  return find?.replace(`--${name}=`, "");
}

const repo = getArg("repo");
const root = getArg("root");

if (!repo) {
  throw Error("--repo required");
}

generateDoc(repo, getArg("tag"), getArg("tag-replace"), root, getArg("out"));

console.log(
  `>> changelog generated for repo ${repo}${
    root ? `#${root.replace("./", "")}` : ""
  }`
);
