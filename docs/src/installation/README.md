<p align="center">
  <br/>
  <img src="https://i.imgur.com/kSLOEIF.png" width="150px">
  <br/>
  <br/>
  <h1 align="center">
    <p  align="center">
      discord.ts (discordx or @typeit/discord)
    </p>
  </h1>
    <p align="center">
      <b>
        Create your discord bot by using TypeScript and decorators!  
      </b>
    <p>
  </p>
  <br/>
</p>

## Introduction

This module is an extension of **[discord.**js**](https://discordjs.guide/)**, so the internal behavior (methods, properties, ...) is the same.

This library allows you to use TypeScript decorators on discord.**js**, it simplify your code and improve the readability !

## Easy setup - starter project

1. Clone this project  
   `git clone https://github.com/oceanroleplay/discord.ts-example`

2. Run `npm i`
3. And let's go, everything was done for you! 🚀

## Installation

Use [npm](https://www.npmjs.com/package/discordx) or yarn to install **discordx** with **discord.js**

> You use the npm @slash tag to install version of discord.ts **discordx** that includes Slash commands (this version)

::: danger
For the moment discord.**js** didn't release the v13 on npm, you have to install it this way  
(You also have to install "reflect-metadata" for the decorators)

```sh
npm i discordx reflect-metadata https://github.com/discordjs/discord.js
```

Install your TypeScript dev dependencies too

```sh
npm i -D @types/node typescript tslib
```

And you should see this in your package.json

```json
{
  // ...
  "dependencies": {
    "discordx": "^X.X.X",
    "discord.js": "github:discordjs/discord.js",
    "reflect-metadata": "^0.1.13"
  },
  "devDependencies": {
    "@types/node": "^15.0.3",
    "tslib": "^2.2.0",
    "typescript": "^4.2.4"
  }
  // ...
}
```

:::

## Execution environnement

To start your bot you can compile your code into JavaScript with TypeScript using the `tsc` command or simple use [ts-node](https://www.npmjs.com/package/ts-node).

::: danger
Be aware that if you compile your code into JavaScript with `tsc` you have to specify .js files when you instanciate your Client

```ts
const client = new Client({
  botId: "test",
  // prefix: "!",
  prefix: async (message: Message) => {
    return "!";
  },
  // glob string to load the classes
  classes: [
    `${__dirname}/comamnds/**/*.discord.{js,ts}`,
    `${__dirname}/events/**/*.discord.{js,ts}`,
  ],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
  silent: false,
});

client.login(BOT_TOKEN);
```

:::

## tsconfig.json

Your tsconfig.json file should look like this:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2017",
    "noImplicitAny": false,
    "sourceMap": true,
    "outDir": "build",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "forceConsistentCasingInFileNames": true,
    "lib": ["es2017", "esnext.asynciterable"],
    "moduleResolution": "node"
  },
  "exclude": ["node_modules"]
}
```

## reflect-metadata

You have to import the reflect-metadata module on your main file for the decorators (for the reflection)

```ts
import "reflect-metadata";
import { Client } from "discordx";

async function start() {
  // ...
}

start();
```

## Need help?

**[Simply join the Discord server](https://discord.gg/VDjwu8E)**

You can also find help with [examples folder](https://github.com/oceanroleplay/discord.ts/tree/slashx/examples)

## See also

- [discord.js's documentation with Interactions (Slash commands)](https://discord.js.org/#/docs/main/master/general/welcome)
- [Discord's Slash commands interactions](https://discord.com/developers/docs/interactions/slash-commands)

## Next step

[Setup and start your application 🚀](/general/client/)
