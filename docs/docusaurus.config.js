// const lightCodeTheme = require('prism-react-renderer/themes/github');
// const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "discord.ts official documentation",
  tagline: "Create your discord bot by using TypeScript and decorators!",
  url: "https://oceanroleplay.github.io",
  baseUrl: "/discord.ts/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "favicon.ico",
  organizationName: "oceanroleplay", // Usually your GitHub org/user name.
  projectName: "discord.ts", // Usually your repo name.
  //  i18n: {
  //    defaultLocale: "en",
  //    locales: ["en", "fr", "de"],
  //  },
  themeConfig: {
    navbar: {
      title: "Discordx",
      items: [
        {
          type: "doc",
          docId: "installation",
          position: "left",
          label: "Docs",
        },
        // {
        //   type: "localeDropdown",
        //   position: "right",
        // },
        {
          position: "right",
          label: "Discord server",
          href: "https://discord.gg/yHQY9fexH9",
        },
        {
          position: "right",
          label: "Github",
          href: "https://github.com/oceanroleplay/discord.ts",
        },
        {
          position: "right",
          label: "NPM",
          href: "https://www.npmjs.com/package/discordx",
        },
      ],
    },
    footer: {
      copyright: "Made by discord.ts team with ❤️",
    },
    algolia: {
      apiKey: "d80ba8eaf70ddb3eb5371d44ebb0ba1a",
      indexName: "discord.ts",
      appId: "C09VVW4QGN",
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarCollapsible: true,
          sidebarCollapsed: false,
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl:
            "https://github.com/oceanroleplay/discord.ts/edit/main/docs/",
          remarkPlugins: [
            [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
          ],
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
  plugins: [
    [
      "docusaurus-plugin-typedoc",
      // Plugin / TypeDoc options
      {
        entryPoints: ["../src/index.ts"],
        tsconfig: "../tsconfig.json",
        excludePrivate: true,
        excludeExternals: true,
        excludeProtected: true,
        readme: "none",
      },
    ],
  ],
};
