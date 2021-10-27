// const lightCodeTheme = require('prism-react-renderer/themes/github');
// const darkCodeTheme = require('prism-react-renderer/themes/dracula');

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
          docId: "api/main/index",
          label: "API",
          position: "left",
          type: "doc",
        },
        {
          docId: "api/utilities/index",
          label: "Utilities",
          position: "left",
          type: "doc",
        },
        {
          docId: "api/music/index",
          label: "Music",
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
          href: "https://www.npmjs.com/package/discordx",
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
          // Please change this to your repo.
          editUrl:
            "https://github.com/oceanroleplay/discord.ts/edit/main/docs/",
          remarkPlugins: [
            [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
          ],
          sidebarCollapsed: false,
          sidebarCollapsible: true,
          sidebarPath: require.resolve("./sidebars.js"),
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     "https://github.com/oceanroleplay/discord.ts/edit/main/docs/",
        // },
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
        entryPoints: ["../src/index.ts"],
        excludeExternals: true,
        excludePrivate: true,
        excludeProtected: true,
        id: "api-1",
        out: "api/main",
        readme: "none",
        tsconfig: "../tsconfig.json",
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
        id: "api-2",
        out: "api/utilities",
        readme: "none",
        tsconfig: "../packages/utilities/tsconfig.json",
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
        id: "api-3",
        out: "api/music",
        readme: "none",
        tsconfig: "../packages/music/tsconfig.json",
      },
    ],
  ],
};
