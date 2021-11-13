import { dirname, importx, isESM, resolve } from "../build/esm/index.js";
const __dirname = dirname(import.meta.url);

console.log(`isESM: ${isESM}`);

console.log(resolve(`${__dirname}/commands/**.js`));

importx(`${isESM ? dirname(import.meta.url) : __dirname}/commands/**.js`);
