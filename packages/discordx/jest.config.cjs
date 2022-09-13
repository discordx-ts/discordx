module.exports = {
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  preset: "ts-jest/presets/default-esm",
  roots: ["<rootDir>/tests"],
  testEnvironment: "node",
  testRegex: "/*.test.ts",
  transform: {
    "<regex_match_files": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};
