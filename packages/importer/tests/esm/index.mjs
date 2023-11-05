import path from "node:path";

import { dirname, importx, isESM, resolve } from "@discordx/importer";

const __dirname = dirname(import.meta.url);

async function main() {
  console.log(`isESM: ${isESM()}`);

  await resolve(path.join(__dirname, "../commands/**.js")).then(console.log);

  importx(path.join(__dirname, "../commands/**.js"));
}

main();
