module.exports = {
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  preset: "ts-jest/presets/default-esm",
  roots: ["<rootDir>/tests"],
  testEnvironment: "node",
  testRegex: "/*.test.ts",
  transform: {},
};
