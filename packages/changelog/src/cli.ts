#! /usr/bin/env node
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

const repo = generateDoc(
  root,
  getArg("out"),
  getArg("tag"),
  getArg("tag-replace"),
  getArgs("ignore-scope")
);

console.log(
  `>> changelog generated for repo ${repo}${
    root ? `#${root.replace("./", "")}` : ""
  }`
);
