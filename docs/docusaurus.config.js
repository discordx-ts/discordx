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
  projectName: "discordx", // Usually your repo name.
  tagline: "Create a discord bot with TypeScript and Decorators!",
  title: "discordx official documentation",
  url: "https://discordx.js.org",
  // eslint-disable-next-line sort-keys
  themeConfig: {
    algolia: {
      apiKey: "d80ba8eaf70ddb3eb5371d44ebb0ba1a",
      appId: "C09VVW4QGN",
      indexName: "discordx",
    },
    footer: {
      copyright: "Made by discordx team with ❤️",
    },
    navbar: {
      items: [
        {
          docId: "packages/index",
          label: "Packages",
          position: "left",
          type: "doc",
        },
        {
          docId: "faq/index",
          label: "F.A.Q",
          position: "left",
          type: "doc",
        },
        // {
        //   type: "localeDropdown",
        //   position: "right",
        // },
        {
          href: "https://discordx.js.org/discord",
          label: "Discord server",
          position: "right",
        },
        {
          href: "https://github.com/discordx-ts/discordx",
          label: "GitHub",
          position: "right",
        },
        {
          href: "https://www.npmjs.com/org/discordx",
          label: "NPM",
          position: "right",
        },
      ],
      title: "DISCORDX",
    },
    prism: {
      darkTheme: require("prism-react-renderer/themes/vsDark"),
      theme: require("prism-react-renderer/themes/github"),
    },
  },
  // eslint-disable-next-line sort-keys
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          editUrl: "https://github.com/discordx-ts/discordx/edit/main/docs/",
          remarkPlugins: [
            [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
          ],
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          sidebarCollapsed: true,
          sidebarCollapsible: true,
          sidebarPath: require.resolve("./sidebars.js"),
        },
        gtag: {
          anonymizeIP: true, // Should IPs be anonymized?
          // code-spell: disable
          trackingID: "G-VD776VLREB",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  // eslint-disable-next-line sort-keys
  plugins: [],
};
