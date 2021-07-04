const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'discord.ts official documentation',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  base: "/discord.ts/",

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: "icon", type: "image/png", href: "https://i.imgur.com/kSLOEIF.png"}],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: 'https://github.com/owencalvin/discord.ts',
    editLinks: true,
    docsDir: 'docs/src',
    editLinkText: 'Edit this page',
    lastUpdated: true,
    nav: [
      {
        text: 'Discord server',
        link: 'https://discord.gg/JbVSu4KxwV',
      }
    ],
    sidebar: [
      {
        title: 'Installation',
        collapsable: false,
        sidebarDepth: 3,
        path: "/installation/",
      },
      {
        title: 'General',
        collapsable: false,
        path: "/general/client",
        sidebarDepth: 3,
        children: [
          ["/general/debugging", "Debugging"],
          ["/general/client", "Client"],
          ["/general/metadatastorage", "MetadataStorage"],
          ["/general/argsof", "ArgsOf"],
          ["/general/events", "List of the events"],
          ["/general/sharding", "Sharding"],
        ]
      },
      {
        title: 'Decorators',
        collapsable: false,
        sidebarDepth: 3,
        path: "/decorators/discord",
        children: [
          ["/decorators/discord", "@Discord"],
          ["/decorators/bot", "@Bot"],
          ["/decorators/button", "@Button"],
          ["/decorators/choice", "@Choice"],
          ["/decorators/choices", "@Choices"],
          ["/decorators/description", "@Description"],
          ["/decorators/group", "@Group"],
          ["/decorators/guard", "@Guard"],
          ["/decorators/guild", "@Guild"],
          ["/decorators/on", "@On"],
          ["/decorators/once", "@Once"],
          ["/decorators/option", "@Option"],
          ["/decorators/defaultpermission", "@DefaultPermission"],
          ["/decorators/permission", "@Permission"],
          ["/decorators/selectmenu", "@SelectMenu"],
          ["/decorators/slash", "@Slash"],
        ]
      }
    ]
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
