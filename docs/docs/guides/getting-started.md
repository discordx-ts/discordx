---
title: Getting Started
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import ThemedImage from "@theme/ThemedImage";

Getting started is very easy, There are two methods, You can either manually install everything you need or you can use our home grown project generator called [create-discordx](/packages/create-discordx/README.md) which uses templates from [discordx-ts/templates](https://github.com/discordx-ts/templates) to generate you a ready to go project.

## ✨ Using create-discordx

To use create-discordx you simply have to execute the following command:

```bash
npx create-discordx@latest
```

Simply read and answer the prompts and you will quickly have a project setup and ready to be coded to your specific needs. If your stuck come back here and follow the guide to get a better idea of how things work.

<ThemedImage
alt="create-discordx demo"
sources={{
    light: "/gifs/create-discordx-demo-light.gif",
    dark: "/gifs/create-discordx-demo-dark.gif",
  }}
/>

## 📥 Manually Installing

To get started manually installing discordx, Create a new project folder and change to that new folder, once you have done that initiate a new npm project using the following command:

<Tabs groupId="package-manager">
<TabItem value="npm" default>

```bash
npm init
```

</TabItem>
<TabItem value="yarn">

```bash
yarn init
```

</TabItem>
<TabItem value="pnpm">

```bash
pnpm init
```

</TabItem>
</Tabs>

This should of generated a `package.json` in the root of your project, Your folder structure should look something like this now:

```
my-discordx-project/
├─ package.json
```

### Installing Dependencies

After initialising a npm project, You will need to install the dependencies which can be done using the following command:

<Tabs groupId="package-manager">
<TabItem value="npm" default>

```bash
npm install discordx discord.js reflect-metadata
```

</TabItem>
<TabItem value="yarn">

```bash
yarn add discordx discord.js reflect-metadata
```

</TabItem>
<TabItem value="pnpm">

```bash
pnpm add discordx discord.js reflect-metadata
```

</TabItem>
</Tabs>

Next you will need to install the dev dependencies, You can install those using the following command:

<Tabs groupId="package-manager">
<TabItem value="npm" default>

```bash
npm install --save-dev @types/node typescript
```

</TabItem>
<TabItem value="yarn">

```bash
yarn add --dev @types/node typescript
```

</TabItem>
<TabItem value="pnpm">

```bash
pnpm add --save-dev @types/node typescript
```

</TabItem>
</Tabs>

### Configuring TypeScript

Due to this being a TypeScript project you will need to create a `tsconfig.json` in the root of your project, You can generate one using the the following command:

<Tabs groupId="package-manager">
<TabItem value="npm" default>

```bash
npm exec tsc --init
```

</TabItem>
<TabItem value="yarn">

```bash
yarn tsc --init
```

</TabItem>
<TabItem value="pnpm">

```bash
pnpm tsc --init
```

</TabItem>
</Tabs>

Or you can copy this one:

```json
{
  "compilerOptions": {
    "module": "ESNext", // required
    "target": "ESNext", // required
    "noImplicitAny": true,
    "sourceMap": true,
    "strict": true,
    "outDir": "build",
    "emitDecoratorMetadata": true, // required
    "experimentalDecorators": true, // required
    "declaration": false,
    "importHelpers": true, // required
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "Node", // required
    "esModuleInterop": true // required
  },
  "exclude": ["node_modules"]
}
```

:::warning
If you decided to generate your own, Make sure its configured the same way as this one otherwise discordx may not work.
:::

### Project Structure

By this point your project structure should now look something like the following:

```ascii
my-discordx-project/
├─ package.json
├─ tsconfig.json
```

## ☎️ Need help?

- [Check frequently asked questions](https://discordx.js.org/docs/faq)
- [Check examples](https://github.com/discordx-ts/discordx/tree/main/packages/discordx/examples)
- Ask in the community [Discord server](https://discordx.js.org/discord)

## 💖 Thank you

You can support [discordx](https://www.npmjs.com/package/discordx) by giving it a [GitHub](https://github.com/discordx-ts/discordx) star.
