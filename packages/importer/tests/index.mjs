import { isESM, resolve, importx } from "../build/esm/index.mjs";
import { fileURLToPath } from "url";
import path from "path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log(`isESM: ${isESM}`);

console.log(resolve([`${__dirname}/commands/**.js`]));

await importx([`${__dirname}/commands/**.js`]);
