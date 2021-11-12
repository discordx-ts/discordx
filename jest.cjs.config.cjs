module.exports = {
  moduleNameMapper: {
    "^(.*?)is-cjs.([jt]s)$": "$1../../scripts/is-cjs.cjs.js",
    "^((?!discord).*?).js$": "$1",
  },
  preset: "ts-jest",
  roots: ["<rootDir>/tests/cjs"],
  testEnvironment: "node",
  testRegex: "/*.test.ts",
  transform: {},
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.cjs.json",
    },
  },
};
