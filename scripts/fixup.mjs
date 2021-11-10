import path from "path";
import shell from "shelljs";

shell.cp(
  "-f",
  path.resolve("./scripts/package-cjs.json"),
  path.resolve("./build/cjs/package.json")
);

shell.cp(
  "-f",
  path.resolve("./scripts/package-mjs.json"),
  path.resolve("./build/mjs/package.json")
);
