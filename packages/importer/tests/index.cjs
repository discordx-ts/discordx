const importer = require("../build/cjs/index.js");

console.log(`isESM: ${importer.isESM}`);

console.log(importer.resolve(`${__dirname}/commands/**.js`));

importer.importx(`${__dirname}/commands/**.js`);
