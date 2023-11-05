const path = require("node:path");
const importer = require("@discordx/importer");

const { importx, isESM, resolve } = importer;

async function main() {
  console.log(`isESM: ${isESM()}`);

  await resolve(path.join(__dirname, "../commands/**.js")).then(console.log);

  importx(path.join(__dirname, "../commands/**.js"));
}

main();
