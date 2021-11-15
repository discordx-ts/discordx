#! /usr/bin/env node
import { generateDoc } from "./index.js";

function getArg(name: string) {
  const find = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  return find?.replace(`--${name}=`, "");
}

const root = getArg("root");

const repo = generateDoc(
  root,
  getArg("out"),
  getArg("tag"),
  getArg("tag-replace")
);

console.log(
  `>> changelog generated for repo ${repo}${
    root ? `#${root.replace("./", "")}` : ""
  }`
);
