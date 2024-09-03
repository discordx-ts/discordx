/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { readFile } from "node:fs/promises";

import boxen from "boxen";
import chalk from "chalk";
import isInstalledGlobally from "is-installed-globally";
import checkForUpdate from "update-check";

/**
 * Read package.json
 */
const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf-8"),
);

/**
 * Check for update
 */

let update = null;

try {
  update = await checkForUpdate(packageJson);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (err) {
  console.log(
    boxen("Failed to check for updates", {
      align: "center",
      borderColor: "red",
      borderStyle: "round",
      margin: 1,
      padding: 1,
    }),
  );
}

if (update) {
  const updateCmd = isInstalledGlobally
    ? "npm i -g create-discordx@latest"
    : "npm i create-discordx@latest";

  const updateVersion = packageJson.version;
  const updateLatest = update.latest;
  const updateCommand = updateCmd;
  const template = `Update available ${chalk.dim(updateVersion)}${chalk.reset(" → ")}${chalk.green(updateLatest)} \nRun ${chalk.cyan(updateCommand)} to update`;

  console.log(
    boxen(template, {
      align: "center",
      borderColor: "yellow",
      borderStyle: "round",
      margin: 1,
      padding: 1,
    }),
  );
}

export default packageJson.version;
