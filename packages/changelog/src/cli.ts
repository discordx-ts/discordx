#!/usr/bin/env node

import { Command } from "commander";

import { GenerateChangelog } from "./index.js";

const program = new Command();

type Options = {
  matchTag: string;
  onlyStage: boolean;
  out: string;
  replaceTag?: string;
  src: string;
};

program.requiredOption("--match-tag <type>", "match tag", "v*");
program.option("--replace-tag <type>", "replace tag text");
program.requiredOption("--src <type>", "source folder for changelog", "./");
program.requiredOption(
  "--out <type>",
  "out dir path with filename",
  "./CHANGELOG.md"
);
program.requiredOption(
  "--only-stage",
  "generate changelog for only stage",
  false
);

const options = program.parse(process.argv).opts<Options>();

GenerateChangelog(options);

console.log(">> changelog generated");
