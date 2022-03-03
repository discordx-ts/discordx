#!/usr/bin/env node

import "./helper/updater.js";

import chalk from "chalk";
import { execSync } from "child_process";
import path from "node:path";
import prompts from "prompts";

import { MakeDir, ValidateNpmName } from "./helper/common.js";
import { tryGitInit } from "./helper/git.js";
import { isFolderEmpty } from "./helper/is-folder-empty.js";
import { DownloadAndExtractTemplate, GetTemplates } from "./helper/template.js";

console.log(`
  ██████╗ ██╗███████╗ ██████╗ ██████╗ ██████╗ ██████╗ ████████╗███████╗
  ██╔══██╗██║██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝
  ██║  ██║██║███████╗██║     ██║   ██║██████╔╝██║  ██║   ██║   ███████╗
  ██║  ██║██║╚════██║██║     ██║   ██║██╔══██╗██║  ██║   ██║   ╚════██║
  ██████╔╝██║███████║╚██████╗╚██████╔╝██║  ██║██████╔╝██╗██║   ███████║
  ╚═════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝╚═╝   ╚══════╝
`);

/**
 * Get project path and name
 */

let projectPath = "./";

const res = await prompts(
  {
    initial: "my-app",
    message: "What is your project named?",
    name: "path",
    type: "text",
    validate: (name) => {
      const validation = ValidateNpmName(path.basename(path.resolve(name)));
      if (validation.valid) {
        return true;
      }

      return "Invalid project name: " + validation.problems?.[0] ?? "unknown";
    },
  },
  {
    onCancel: () => {
      process.exit();
    },
  }
);

if (typeof res.path === "string") {
  projectPath = res.path.trim();
}

const resolvedProjectPath = path.resolve(projectPath);
const projectName = path.basename(resolvedProjectPath);

/**
 * Select template prompt
 */

const templateList = await GetTemplates();

if (!templateList.length) {
  console.log(chalk.red("> Unable to load templates :("));
  process.exit();
}

const response = await prompts<string>(
  {
    choices: templateList,
    message: "Pick template",
    name: "template",
    type: "select",
  },
  {
    onCancel: () => {
      process.exit();
    },
  }
);

if (!response.template || typeof response.template !== "string") {
  console.log(chalk.red("> Please select a template :("));
  process.exit();
}

/**
 * Make project directory
 */

try {
  await MakeDir(resolvedProjectPath);
} catch (err) {
  console.log(chalk.red("> Failed to create specified directory :("));
  process.exit();
}

/**
 * Make sure directory is clean
 */

if (!isFolderEmpty(resolvedProjectPath, projectName)) {
  process.exit();
}

/**
 * Download and extract template
 */

try {
  await DownloadAndExtractTemplate(resolvedProjectPath, response.template);
} catch (err) {
  console.log(chalk.red("> Failed to download selected template :("));
  process.exit();
}

/**
 * Update project name
 */

try {
  execSync(
    `npx -y json -I -f package.json -e "this.name=\\"${projectName}\\""`,
    {
      cwd: resolvedProjectPath,
      stdio: "ignore",
    }
  );
} catch (err) {
  console.log(chalk.red("> Failed to update project name :("));
}

/**
 * Init git
 */

tryGitInit(resolvedProjectPath);

/**
 * End
 */
const isWin = process.platform === "win32";

console.log(
  chalk.green("√"),
  chalk.bold("Created discordx (discord.ts) project"),
  chalk.gray("»"),
  chalk.green(projectName)
);
console.log(chalk.blue("?"), chalk.bold("Next Steps!"));
console.log(`\t> cd ${projectPath}`);
console.log("\t> npm install");
if (isWin) {
  console.log("\t> set BOT_TOKEN = REPLACE_THIS_WITH_TOKEN");
} else {
  console.log("\t> export BOT_TOKEN = REPLACE_THIS_WITH_TOKEN");
}
console.log("\t> npm run dev");
console.log();
console.log(chalk.blue("?"), chalk.bold("Support"));
console.log("    Discord Server: https://discord.gg/yHQY9fexH9");
console.log("     Documentation: https://discord-ts.js.org");
console.log("            GitHub: https://github.com/oceanroleplay/discord.ts");
console.log();
console.log(
  chalk.green("√"),
  chalk.bold("Thank you for using Discordx"),
  chalk.red("❤️")
);
