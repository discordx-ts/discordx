import fs from "fs";
import glob from "glob";

function argResolve(search) {
  const findPathArg = process.argv.find((arg) => arg.includes(`--${search}=`));
  if (!findPathArg) {
    return;
  }

  return findPathArg.replace(`--${search}=`, "");
}

const buildPath = argResolve("path");

if (!buildPath) {
  console.log("--path is required arg");
} else {
  const files = glob.sync(buildPath + "/**/*.mts");
  console.log(files);
  files.forEach((file) => {
    const data = fs.readFileSync(file, {
      encoding: "utf-8",
    });
    fs.rmSync(file);
    fs.writeFileSync(
      file.replaceAll(/\.mts$/gm, ".ts"),
      data.replaceAll(/\.mjs/gm, ".js")
    );
  });

  console.log("postbuild completed...");
}
