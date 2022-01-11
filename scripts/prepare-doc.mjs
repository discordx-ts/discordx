import fs from "fs";

const packages = [
  "changelog",
  "di",
  "discordx",
  "importer",
  "internal",
  "koa",
  "music",
  "pagination",
  "utilities",
];

for (const pkg in packages) {
  const dirPath = "docs/packages/" + packages[pkg];
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  const filePath = dirPath + "/README.md";
  if (!fs.existsSync(filePath)) {
    fs.copyFileSync(`../packages/${packages[pkg]}/README.md`, filePath);
  }
}

console.log("doc pepared");
