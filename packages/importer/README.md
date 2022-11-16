<div>
  <p align="center">
    <a href="https://discordx.js.org" target="_blank" rel="nofollow">
      <img src="https://discordx.js.org/discordx.svg" width="546" />
    </a>
  </p>
  <div align="center" class="badge-container">
    <a href="https://discordx.js.org/discord"
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
  </div>
  <p align="center">
    <b> Create a discord bot with TypeScript and Decorators! </b>
  </p>
</div>

# 📖 Introduction

> You can use this library without discordx

Support esm and cjs at the same time

# 💻 Installation

Version 16.6.0 or newer of Node.js is required

```
npm install @discordx/importer
yarn add @discordx/importer
```

# Usage

If you use this code with esm or ejs, it will tell you about your environment.

```ts
import { isESM } from "@discordx/importer";

console.log(`isESM: ${isESM}`);
```

## Resolve glob paths

```ts
console.log(resolve(`${__dirname}/commands/**.js`));
```

## Import glob paths

Here is an example that could be used with the commonjs or esm modules

### Module - CommonJS

```ts
importx(`${__dirname}/commands/**.js`).then(() =>
  console.log("All files imported")
);
```

### Module - ESNext

Remember: In esm, `__dirname` is not defined, so here is a workaround

```ts
import { dirname, importx } from "@discordx/importer";
const __dirname = dirname(import.meta.url);

importx(`${__dirname}/commands/**.js`).then(() =>
  console.log("All files imported")
);
```

### Combine - CommonJS and ESNext

If you are creating a module or extension of your own library, you can set it to auto-import paths based on the user module

```ts
import { dirname, importx, isESM } from "@discordx/importer";
const folder = isESM ? dirname(import.meta.url) : __dirname;

importx(`${folder}/commands/**.js`).then(() =>
  console.log("All files imported")
);
```

### Use relative path

You can use relative path, which will be more convenient to write code by eliminating DIRNAME

```ts
import { importx } from "@discordx/importer";

// relative path start from root folder
importx("./tests/commands/**.js").then(() => console.log("All files imported"));
```

# 📜 Documentation

- [discordx.js.org](https://discordx.js.org)
- [Tutorials (dev.to)](https://dev.to/samarmeena/series/14317)

# ☎️ Need help?

- [Check frequently asked questions](https://discordx.js.org/docs/faq)
- [Check examples](https://github.com/discordx-ts/discordx/tree/main/packages/discordx/examples)
- Ask in the community [Discord server](https://discordx.js.org/discord)

# 💖 Thank you

You can support [discordx](https://www.npmjs.com/package/discordx) by giving it a [GitHub](https://github.com/discordx-ts/discordx) star.
