/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  semi: true,
  endOfLine: "auto",
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: ["<BUILTIN_MODULES>", "<THIRD_PARTY_MODULES>", "", "^[./]"],
  importOrderParserPlugins: ["typescript", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.9.2",
};

export default config;
