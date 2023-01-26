export default {
  preset: "ts-jest/presets/default-esm",
  resolver: "ts-jest-resolver",
  roots: ["<rootDir>/tests"],
  testEnvironment: "node",
  testRegex: "/*.test.ts",
};
