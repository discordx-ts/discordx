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
    <a href="https://www.npmjs.com/package/@discordx/socket.io"
      ><img
        src="https://img.shields.io/npm/v/@discordx/socket.io.svg?maxAge=3600"
        alt="NPM version"
    /></a>
    <a href="https://www.npmjs.com/package/@discordx/socket.io"
      ><img
        src="https://img.shields.io/npm/dt/@discordx/socket.io.svg?maxAge=3600"
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

This module is an extension of socket.io, so the internal behavior (methods, properties, ...) is the same

This library allows you to use TypeScript decorators on socket.io, it simplifies your code and improves the readability!

# 💻 Installation

Version 16.6.0 or newer of Node.js is required

```
npm install socket.io @discordx/socket.io
yarn add socket.io @discordx/socket.io
```

# 🆕 Features

- Support multiple server in a single nodejs instance (@AppId)
- Support TSyringe
- Support ECMAScript

# 📟 @On/@Once

> do not forget to wrap each class with `@Ws()`

```ts
import { Guard, Next, On, Once, Server, Ws } from "@discordx/socket.io";
import { Socket } from "socket.io";

@Ws()
class Example {
  @On("connection")
  @Guard(([]: [Socket], server: Server, socket: unknown, next: Next) => {
    console.log("I am mdw");
    return next();
  })
  on(): void {
    console.log("I am @onx");
  }

  @On("disconnect")
  disconnect(): void {
    console.log("I am disconnect");
  }

  @Once("connection")
  once(): void {
    console.log("I am @Once");
  }
}
```

# 📜 Documentation

- [discordx.js.org](https://discordx.js.org)
- [Tutorials (dev.to)](https://dev.to/oceanroleplay/series/14317)

# ☎️ Need help?

- [Check frequently asked questions](https://discordx.js.org/docs/faq)
- [Check examples](https://github.com/discordx-ts/discordx/tree/main/packages/discordx/examples)
- Ask in the community [Discord server](https://discordx.js.org/discord)

# 💖 Thank you

You can support [discordx](https://www.npmjs.com/package/discordx) by giving it a [GitHub](https://github.com/discordx-ts/discordx) star.
