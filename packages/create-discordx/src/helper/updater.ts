import { readFile } from "node:fs/promises";
import checkForUpdate from "update-check";

/**
 * Read package.json
 */
const packageJson = JSON.parse(
  await readFile(new URL("../../package.json", import.meta.url), "utf-8")
);

/**
 * Check for update
 */

let update = null;

try {
  update = await checkForUpdate(packageJson);
} catch (err) {
  console.error(`Failed to check for updates: ${err}`);
}

if (update) {
  console.log(`The latest version is ${update.latest}. Please update!`);
}
