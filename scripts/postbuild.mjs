import fs from "fs";
// import glob from "glob";

function argPath(search) {
  const findPathArg = process.argv.find((arg) => arg.includes(`--${search}=`));
  if (!findPathArg) {
    return undefined;
  }

  return findPathArg.replace(`--${search}=`, "");
}

const path = argPath("path");
const module = argPath("module");

if (!path || !module) {
  console.log("--path, --module are required args");
} else if (module !== "cjs" && module !== "esm") {
  console.log("Invalid module, valid values are: cjs, esm");
} else {
  fs.writeFileSync(
    path + "/package.json",
    module === "cjs" ? '{"type":"commonjs"}' : '{"type":"module"}'
  );
  // uncomment below code after stable typescript 4.5
  //   const jsExt = module === "cjs" ? ".cjs" : ".mjs";
  //   const tsExt = module === "cjs" ? ".cts" : ".mts";
  //   const files = glob.sync(path + "/**/*.{js,d.ts,js.map}");
  //   files.forEach((file) => {
  //     const data = fs.readFileSync(file, {
  //       encoding: "utf-8",
  //     });
  //     fs.rmSync(file);
  //     fs.writeFileSync(
  //       file.replaceAll(/\.js/gm, jsExt).replaceAll(/\.ts/gm, tsExt),
  //       data
  //         .replaceAll(/\.js/gm, jsExt)
  //         .replaceAll('"' + "discord" + jsExt + '"', '"discord.js"')
  //         .replaceAll('"' + "v9" + jsExt + '"', '"v9.js"')
  //     );
  //  });

  console.log("postbuild completed...");
}
