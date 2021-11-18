const importer = require("../build/cjs/index.cjs");

console.log(`isESM: ${importer.isESM}`);

console.log(importer.resolve("./tests/commands/**.js"));

importer.importx(`${__dirname}/commands/**.js`);
