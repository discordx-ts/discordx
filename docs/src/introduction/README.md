<p align="center">
  <br/>
  <img src="https://i.imgur.com/kSLOEIF.png" width="150px">
  <br/>
  <br/>
  <h1 align="center">
    <p  align="center">
      discord.ts (@typeit/discord)
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

## Installation
Use [npm](https://www.npmjs.com/package/@typeit/discord) or yarn to install **@typeit/discord** with **discord.js**

::: danger
For the moment discord.**js** didn't release the v13 on npm, you have to install it this way:
```sh
npm i @typeit/discord
```
```sh
npm i https://github.com/discordjs/discord.js
```
And you should see this in your package.json
```json
{
  // ...
  "dependencies": {
    "@typeit/discord": "^X.X.X",
    "discord.js": "github:discordjs/discord.js",
  }
  // ...
}
```
:::

<!--
```sh
npm i @typeit/discord discord.js
```
-->

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

## Setup and start your application

In order to start your application, you must use the discord.**ts**'s Client (not the client that is provided by discord.**js**!).  
It works the same as the discord.**js**'s Client (same methods, properties, ...).

- **`classes` (required)**:  
  Indicate the class jacket of your classes containing the `@Discord` decorator. It accepts a list of classes or of (glob) paths

- **`silent` (`false` by default)**:  
  Allows you to disable your event information at startup

- **`guards` (`[]` by default)**:  
  Global guards, it's an array of functions

- **`slashGuilds`**:  
  The slash commands are executed only on this list of guilds by default

- **`requiredByDefault`**:  
  The `@Option` are required by default 

**You must specify the glob path(s) where your decorated classes are**

```typescript
// Use the Client that are provided by @typeit/discord NOT discord.js
import { Client } from "@typeit/discord";

async function start() {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
    ],
    classes: [
      `${__dirname}/*Discord.ts`, // glob string to load the classes
      `${__dirname}/*Discord.js`, // If you compile using "tsc" the file extension change to .js
    ],
    silent: false,
  });

  await client.login("YOUR_TOKEN");
}

start();
```

## ☎️ Need help?

**[Simply join the Discord server](https://discord.gg/VDjwu8E)**  

You can also find help with the [different projects that use discord.ts](https://github.com/OwenCalvin/discord.ts/network/dependents?package_id=UGFja2FnZS00Njc1MzYwNzU%3D) and in the [examples folder](https://github.com/OwenCalvin/discord.ts/tree/master/examples)
