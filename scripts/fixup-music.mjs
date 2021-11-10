import path from "path";
import shell from "shelljs";

shell.cp(
  "-f",
  path.resolve("../../scripts/package-cjs.json"),
  path.resolve("../../packages/music/build/cjs/package.json")
);

shell.cp(
  "-f",
  path.resolve("../../scripts/package-esm.json"),
  path.resolve("../../packages/music/build/esm/package.json")
);
