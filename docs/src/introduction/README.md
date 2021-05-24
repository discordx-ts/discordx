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

> You use the npm @slash tag to install version of discord.ts **@typeit/discord** that includes Slash commands (this version)

::: danger
For the moment discord.**js** didn't release the v13 on npm, you have to install it this way  
(You also have to install "reflect-metadata" for the decorators)
```sh
npm i @typeit/discord@slash reflect-metadata https://github.com/discordjs/discord.js 
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
    "@typeit/discord": "^X.X.X",
    "discord.js": "github:discordjs/discord.js",
    "reflect-metadata": "^0.1.13",
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
  // glob string to load the classes
  classes: [
    `${__dirname}/*Discord.ts`, // If you use ts-node
    `${__dirname}/*Discord.js`, // If you compile using "tsc" the file extension change to .js
  ],
  silent: false,
  // At instanciation
  guards: [NotBot, Prefix("!")],
});
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
import { Client } from "@typeit/discord";

async function start() {
  // ...
}

start();
```

## Need help?
**[Simply join the Discord server](https://discord.gg/VDjwu8E)**  

You can also find help with the [different projects that use discord.ts](https://github.com/OwenCalvin/discord.ts/network/dependents?package_id=UGFja2FnZS00Njc1MzYwNzU%3D) and in the [examples folder](https://github.com/OwenCalvin/discord.ts/tree/master/examples)

## Next step
[Setup and start your application 🚀](/discord.ts/general/client)
