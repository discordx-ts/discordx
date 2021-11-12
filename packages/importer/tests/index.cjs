const importer = require("../build/cjs/index.cjs");

console.log(`isESM: ${importer.isESM}`);

console.log(importer.resolve([`${__dirname}/commands/**.js`]));
