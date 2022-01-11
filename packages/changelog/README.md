<div>
  <p align="center">
    <a href="https://discord-ts.js.org" target="_blank" rel="nofollow">
      <img src="https://discord-ts.js.org/discord-ts.svg" width="546" />
    </a>
  </p>
  <p align="center">
    <a href="https://discord.gg/yHQY9fexH9"
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
    <a href="https://github.com/oceanroleplay/discord.ts/actions"
      ><img
        src="https://github.com/oceanroleplay/discord.ts/workflows/Build/badge.svg"
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
| --tag-replace  | No       | undefined        | repalcement in tag         |
| --ignore-scope | No       | undefined        | ignore scopes              |
| --header       | No       | `# Stage\n\n`    | set custom header          |

# ☎️ Need help?

Ask in **[discord server](https://discord.gg/yHQY9fexH9)** or open a **[issue](https://github.com/oceanroleplay/discord.ts/issues)**

# Thank you

Show your support for [discordx](https://www.npmjs.com/package/discordx) by giving us a star on [github](https://github.com/oceanroleplay/discord.ts).
