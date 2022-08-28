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

This module is an extension of koa, so the internal behavior (methods, properties, ...) is the same

This library allows you to use TypeScript decorators on koa, it simplifies your code and improves the readability!

# 💻 Installation

Version 16.6.0 or newer of Node.js is required

```
npm install koa @koa/router @discordx/koa
yarn add koa @koa/router @discordx/koa
```

Install required types

```
npm install --save-dev @types/koa__router
yarn add --dev @types/koa__router
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

# 📜 Documentation

- [discordx.js.org](https://discordx.js.org)
- [Tutorials (dev.to)](https://dev.to/oceanroleplay/series/14317)

# ☎️ Need help?

- [Check frequently asked questions](https://discordx.js.org/docs/faq)
- [Check examples](https://github.com/discordx-ts/discordx/tree/main/packages/discordx/examples)
- Ask in the community [Discord server](https://discordx.js.org/discord)

# 💖 Thank you

You can support [discordx](https://www.npmjs.com/package/discordx) by giving it a [GitHub](https://github.com/discordx-ts/discordx) star.
