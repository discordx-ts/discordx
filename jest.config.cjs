module.exports = {
  moduleNameMapper: {
    "^((?!discord).*?).js$": "$1",
  },
  preset: "ts-jest",
  roots: ["<rootDir>/tests"],
  testEnvironment: "node",
  testRegex: "/*.test.ts",
  transform: {},
};
