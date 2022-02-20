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
    <a href="https://www.npmjs.com/package/@discordx/koa"
      ><img
        src="https://img.shields.io/npm/v/@discordx/koa.svg?maxAge=3600"
        alt="NPM version"
    /></a>
    <a href="https://www.npmjs.com/package/@discordx/koa"
      ><img
        src="https://img.shields.io/npm/dt/@discordx/koa.svg?maxAge=3600"
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

This module is an extension of koa, so the internal behavior (methods, properties, ...) is the same

This library allows you to use TypeScript decorators on koa, it simplifies your code and improves the readability!

# 💻 Installation

Version 16.6.0 or newer of Node.js is required

```
npm install koa @koa/router @discordx/koa
yarn add koa @koa/router @discordx/koa
```

# 🆕 Features

- `@Router` to create a router on class
- Support multiple server in a single nodejs instance (@Api)
- Support TSyringe
- Support ECMAScript

# 📟 @Get / @Post ...

Decorators for all koa methods, `@Get @Post @All @Delete @Head @Link @Unlink @Options`

> KOA instance available at the end of each handler's arguments

## Example

```ts
@Router()
class Example {
  @Get("/")
  handle(ctx: RouterContext, next: Next, koa: Koa): Promise<Next> {
    ctx.body = "Hello world!";
    return next();
  }
}
```

# 📟 @Middleware

> If you add middleware to a class, it will be executed on each route within it.

## Example

```ts
function Log(ctx: RouterContext, next: Next) {
  console.log("request: " + ctx.URL);
  return next();
}

function Authenticated(ctx: RouterContext, next: Next) {
  ctx.body = "unauthorized required";
  // we are not returning next, to avoid further execution
  return;
}

@Router()
@Middleware(Log) // will execute for all sub routes
class Example {
  @Get("/")
  hello(ctx: RouterContext, next: Next): Promise<Next> {
    ctx.body = "Hello world!";
    return next();
  }

  @Get("/auth")
  @Middleware(Authenticated)
  auth(ctx: RouterContext, next: Next): Promise<Next> {
    ctx.body = "Hello world!";
    return next();
  }
}
```

# ☎️ Need help?

Ask in **[discord server](https://discord.gg/yHQY9fexH9)** or open a **[issue](https://github.com/oceanroleplay/discord.ts/issues)**

# Thank you

Show your support for [discordx](https://www.npmjs.com/package/discordx) by giving us a star on [github](https://github.com/oceanroleplay/discord.ts).
