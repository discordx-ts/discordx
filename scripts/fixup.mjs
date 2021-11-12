import path from "path";
import shell from "shelljs";

shell.cp(
  "-f",
  path.resolve("./scripts/package-cjs.json"),
  path.resolve("./build/cjs/package.json")
);

shell.cp(
  "-f",
  path.resolve("./scripts/package-esm.json"),
  path.resolve("./build/esm/package.json")
);

shell.cp(
  "-f",
  path.resolve("./scripts/is-cjs.cjs.js"),
  path.resolve("./build/cjs/util/is-cjs.js")
);

console.log("fixup complete...");
