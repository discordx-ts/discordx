<div>
  <p align="center">
    <img src="https://discord-ts.js.org/discord-ts.svg" width="546" />
  </p>
  <p align="center">
    <a href="https://discord.gg/yHQY9fexH9"
      ><img
        src="https://img.shields.io/discord/874802018361950248?color=5865F2&logo=discord&logoColor=white"
        alt="Discord server"
    /></a>
    <a href="https://www.npmjs.com/package/@discordx/importer"
      ><img
        src="https://img.shields.io/npm/v/@discordx/importer.svg?maxAge=3600"
        alt="NPM version"
    /></a>
    <a href="https://www.npmjs.com/package/@discordx/importer"
      ><img
        src="https://img.shields.io/npm/dt/@discordx/importer.svg?maxAge=3600"
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

# @discordx/importer

Support esm and cjs at the same time

# Usage

If you use this code with esm or ejs, it will tell you about your environment.

```ts
import { isESM } from "@discordx/importer";

console.log(`isESM: ${isESM}`);
```

## Resolve glob paths

```ts
console.log(resolve([`${__dirname}/commands/**.js`]));
```

## Import glob paths

```ts
console.log(importx([`${__dirname}/commands/**.js`]));
```
