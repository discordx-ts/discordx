import fs from "fs";

function argPath(search) {
  const findPathArg = process.argv.find((arg) => arg.includes(`--${search}=`));
  if (!findPathArg) {
    return undefined;
  }

  return findPathArg.replace(`--${search}=`, "");
}

const path = argPath("path");

if (!path) {
  console.log("--path are required args");
} else {
  fs.writeFileSync(path + "/cjs/package.json", '{"type":"commonjs"}');
  fs.writeFileSync(path + "/esm/package.json", '{"type":"module"}');
  console.log("postbuild completed...");
}
