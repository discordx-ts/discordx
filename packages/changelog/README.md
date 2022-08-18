<div>
  <p align="center">
    <a href="https://discordx.js.org" target="_blank" rel="nofollow">
      <img src="https://discordx.js.org/discordx.svg" width="546" />
    </a>
  </p>
  <p align="center">
    <a href="https://discordx.js.org/discord"
      ><img
        src="https://img.shields.io/discord/874802018361950248?color=5865F2&logo=discord&logoColor=white"
        alt="Discord server"
    /></a>
    <a href="https://www.npmjs.com/package/@discordx/changelog"
      ><img
        src="https://img.shields.io/npm/v/@discordx/changelog.svg?maxAge=3600"
        alt="NPM version"
    /></a>
    <a href="https://www.npmjs.com/package/@discordx/changelog"
      ><img
        src="https://img.shields.io/npm/dt/@discordx/changelog.svg?maxAge=3600"
        alt="NPM downloads"
    /></a>
    <a href="https://github.com/discordx-ts/discordx/actions"
      ><img
        src="https://github.com/discordx-ts/discordx/workflows/Build/badge.svg"
        alt="Build status"
    /></a>
    <a href="https://www.paypal.me/vijayxmeena"
      ><img
        src="https://img.shields.io/badge/donate-paypal-F96854.svg"
        alt="paypal"
    /></a>
  </p>
  <p align="center">
    <b> Create a discord bot with TypeScript and Decorators! </b>
  </p>
</div>

# 📖 Introduction

changelog generator, written in TypeScript with Node.js

# 💻 Installation

> Version 16.6.0 or newer of [Node.js](https://nodejs.org/) is required

```
npm install @discordx/changelog
yarn add @discordx/changelog
```

# Supported Scopes

`build, chore, ci, docs, feat, fix, refactor, revert, test, types, workflow, BREAKING CHANGE`

# Options

The following options are only available

| Name           | Required | Default          | Description                |
| -------------- | -------- | ---------------- | -------------------------- |
| --root         | No       | "./"             | root folder path           |
| --out          | No       | "./CHANGELOG.md" | changelog file path        |
| --tag          | No       | "v\*"            | tag to match with releases |
| --tag-replace  | No       | undefined        | replacement in tag         |
| --ignore-scope | No       | undefined        | ignore scopes              |
| --header       | No       | `# Stage\n\n`    | set custom header          |

# 📜 Documentation

- [discordx.js.org](https://discordx.js.org)
- [Tutorials (dev.to)](https://dev.to/oceanroleplay/series/14317)

# ☎️ Need help?

- [Check frequently asked questions](https://discordx.js.org/docs/faq)
- [Check examples](https://github.com/discordx-ts/discordx/tree/main/packages/discordx/examples)
- Ask in the community [Discord server](https://discordx.js.org/discord)

# 💖 Thank you

You can support [discordx](https://www.npmjs.com/package/discordx) by giving it a [GitHub](https://github.com/discordx-ts/discordx) star.
