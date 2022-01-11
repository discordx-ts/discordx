/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  baseUrl: "/",
  favicon: "favicon.ico",
  // i18n: {
  //   defaultLocale: "en",
  //   locales: ["en", "fr", "de"],
  // },
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  organizationName: "oceanroleplay", // Usually your GitHub org/user name.
  projectName: "discord.ts", // Usually your repo name.
  tagline: "Create a discord bot with TypeScript and Decorators!",
  title: "discord.ts official documentation",
  url: "https://discord-ts.js.org",
  // eslint-disable-next-line sort-keys
  themeConfig: {
    algolia: {
      apiKey: "d80ba8eaf70ddb3eb5371d44ebb0ba1a",
      appId: "C09VVW4QGN",
      indexName: "discord.ts",
    },
    footer: {
      copyright: "Made by discord.ts team with ❤️",
    },
    gtag: {
      anonymizeIP: true, // Should IPs be anonymized?
      trackingID: "G-VD776VLREB",
    },
    navbar: {
      items: [
        {
          docId: "installation",
          label: "Docs",
          position: "left",
          type: "doc",
        },
        {
          docId: "packages/discordx/README",
          label: "API",
          position: "left",
          type: "doc",
        },
        {
          docId: "packages",
          label: "Packages",
          position: "left",
          type: "doc",
        },
        // {
        //   type: "localeDropdown",
        //   position: "right",
        // },
        {
          href: "https://discord.gg/yHQY9fexH9",
          label: "Discord server",
          position: "right",
        },
        {
          href: "https://github.com/oceanroleplay/discord.ts",
          label: "Github",
          position: "right",
        },
        {
          href: "https://www.npmjs.com/org/discordx",
          label: "NPM",
          position: "right",
        },
      ],
      title: "DISCORD.TS",
    },
    prism: {
      darkTheme: require("prism-react-renderer/themes/vsDark"),
      theme: require("prism-react-renderer/themes/vsLight"),
    },
  },
  // eslint-disable-next-line sort-keys
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          editUrl:
            "https://github.com/oceanroleplay/discord.ts/edit/main/docs/",
          remarkPlugins: [
            [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
          ],
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          sidebarCollapsed: true,
          sidebarCollapsible: true,
          sidebarPath: require.resolve("./sidebars.js"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  // eslint-disable-next-line sort-keys
  plugins: [
    [
      "docusaurus-plugin-typedoc",
      // Plugin / TypeDoc options
      {
        entryPoints: ["../packages/discordx/src/index.ts"],
        excludeExternals: true,
        excludePrivate: true,
        excludeProtected: true,
        id: "api-1",
        name: "discordx",
        out: "packages/discordx/api",
        readme: "none",
        tsconfig: "../packages/discordx/tsconfig.json",
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      // Plugin / TypeDoc options
      {
        entryPoints: ["../packages/music/src/index.ts"],
        excludeExternals: true,
        excludePrivate: true,
        excludeProtected: true,
        id: "api-2",
        name: "@discordx/music",
        out: "packages/music/api",
        readme: "none",
        tsconfig: "../packages/music/tsconfig.json",
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      // Plugin / TypeDoc options
      {
        entryPoints: ["../packages/utilities/src/index.ts"],
        excludeExternals: true,
        excludePrivate: true,
        excludeProtected: true,
        id: "api-3",
        name: "@discordx/utilities",
        out: "packages/utilities/api",
        readme: "none",
        tsconfig: "../packages/utilities/tsconfig.json",
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      // Plugin / TypeDoc options
      {
        entryPoints: ["../packages/pagination/src/index.ts"],
        excludeExternals: true,
        excludePrivate: true,
        excludeProtected: true,
        id: "api-4",
        name: "@discordx/pagination",
        out: "packages/pagination/api",
        readme: "none",
        tsconfig: "../packages/pagination/tsconfig.json",
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      // Plugin / TypeDoc options
      {
        entryPoints: ["../packages/changelog/src/index.ts"],
        excludeExternals: true,
        excludePrivate: true,
        excludeProtected: true,
        id: "api-5",
        name: "@discordx/changelog",
        out: "packages/changelog/api",
        readme: "none",
        tsconfig: "../packages/changelog/tsconfig.json",
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      // Plugin / TypeDoc options
      {
        entryPoints: ["../packages/di/src/index.ts"],
        excludeExternals: true,
        excludePrivate: true,
        excludeProtected: true,
        id: "api-6",
        name: "@discordx/di",
        out: "packages/di/api",
        readme: "none",
        tsconfig: "../packages/di/tsconfig.json",
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      // Plugin / TypeDoc options
      {
        entryPoints: ["../packages/internal/src/index.ts"],
        excludeExternals: true,
        excludePrivate: true,
        excludeProtected: true,
        id: "api-8",
        name: "@discordx/internal",
        out: "packages/internal/api",
        readme: "none",
        tsconfig: "../packages/internal/tsconfig.json",
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      // Plugin / TypeDoc options
      {
        entryPoints: ["../packages/koa/src/index.ts"],
        excludeExternals: true,
        excludePrivate: true,
        excludeProtected: true,
        id: "api-9",
        name: "@discordx/koa",
        out: "packages/koa/api",
        readme: "none",
        tsconfig: "../packages/koa/tsconfig.json",
      },
    ],
  ],
};
