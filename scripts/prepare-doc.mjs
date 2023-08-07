import fs from "fs";

const packages = [
  "changelog",
  "create-discordx",
  "di",
  "discordx",
  "importer",
  "internal",
  "koa",
  "lava-player",
  "lava-queue",
  "music",
  "pagination",
  "socket.io",
  "utilities",
];

for (const pkg in packages) {
  const dirPath = "docs/" + packages[pkg];
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  const filePath = dirPath + "/README.md";
  const content = fs.readFileSync(`../packages/${packages[pkg]}/README.md`);
  fs.writeFileSync(
    filePath,
    "---\ntitle: Readme\nsidebar_position: 0\n---\n\n# &nbsp;\n\n" + content,
  );
}

console.log("doc prepared");
