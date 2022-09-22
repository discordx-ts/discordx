#!/usr/bin/env node

import { generateDoc } from "./index.js";

function getArg(name: string): string | undefined {
  const find = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  return find?.replace(`--${name}=`, "");
}

function getArgs(name: string): string[] {
  const cl: string[] = [];
  process.argv.forEach((arg) => {
    const match = `--${name}=`;
    if (arg.startsWith(match)) {
      cl.push(arg.replace(match, ""));
    }
  });
  return cl;
}

const root = getArg("root");

const repo = generateDoc({
  header: getArg("header"),
  ignoreScopes: getArgs("ignore-scope"),
  outDir: getArg("out"),
  root,
  tag: {
    match: getArg("tag"),
    onlyStage: getArg("only-stage") !== undefined ? true : false,
    replace: getArg("tag-replace"),
  },
});

console.log(
  `>> changelog generated for repo ${repo}${
    root ? `#${root.replace("./", "")}` : ""
  }`
);
