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
