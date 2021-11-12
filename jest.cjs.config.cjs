module.exports = {
  moduleNameMapper: {
    "^((?!discord).*?).js$": "$1",
  },
  preset: "ts-jest",
  roots: ["<rootDir>/tests/cjs"],
  testEnvironment: "node",
  testRegex: "/*.test.ts",
  transform: {},
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.cjs.json'
    }
  }
};
