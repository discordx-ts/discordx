import fs from "fs";
import glob from "glob";

function argResolve(search) {
  const findPathArg = process.argv.find((arg) => arg.includes(`--${search}=`));
  if (!findPathArg) {
    return undefined;
  }

  return findPathArg.replace(`--${search}=`, "");
}

const buildPath = argResolve("path");

if (!buildPath) {
  console.log("--path is required arg");
} else {
  const files = glob.sync(buildPath + "/**/*.{mjs,d.mts,mjs.map}");
  files.forEach((file) => {
    const data = fs.readFileSync(file, {
      encoding: "utf-8",
    });
    fs.rmSync(file);
    fs.writeFileSync(
      file
        .replaceAll(/\.d\.mts$/gm, ".d.cts")
        .replaceAll(/\.mjs\.map$/gm, ".cjs.map")
        .replaceAll(/\.mjs$/gm, ".cjs"),
      data.replaceAll(/\.mjs/gm, ".cjs")
    );
  });

  console.log("postbuild completed...");
}
