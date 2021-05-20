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

  base: "/graphql-composer-decorators/",

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
    docsDir: '',
    editLinkText: 'Edit this page',
    lastUpdated: true,
    nav: [
      {
        text: 'Discord',
        link: 'https://discord.gg/JbVSu4KxwV',
      }
    ],
    sidebar: [
      {
        title: 'Introduction',
        collapsable: false,
        sidebarDepth: 3,
        path: "/introduction/",
      },
      {
        title: 'General',
        collapsable: false,
        path: "/general/",
        sidebarDepth: 3,
        children: [
          ["/general/client", "Client"],
          ["/general/metadatastorage", "MetadataStorage"],
          ["/general/argsof", "ArgsOf"],
          ["/general/events", "List of the events"]
        ]
      },
      {
        title: 'Decorators',
        collapsable: false,
        sidebarDepth: 3,
        path: "/decorators/",
        children: [
          ["/decorators/discord", "@Discord"],
          ["/decorators/on", "@On"],
          ["/decorators/once", "@Once"],
          ["/decorators/slash", "@Slash"],
          ["/decorators/option", "@Option"],
          ["/decorators/choice", "@Choice"],
          ["/decorators/permission", "@Permission"],
          ["/decorators/group", "@Group"],
          ["/decorators/guard", "@Guard"],
          ["/decorators/description", "@Description"],
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
