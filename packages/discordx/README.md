<div>
  <p align="center">
    <a href="https://discord-ts.js.org" target="_blank" rel="nofollow">
      <img src="https://discord-ts.js.org/discord-ts.svg" width="546" />
    </a>
  </p>
  <p align="center">
    <a href="https://discord-ts.js.org/discord"
      ><img
        src="https://img.shields.io/discord/874802018361950248?color=5865F2&logo=discord&logoColor=white"
        alt="Discord server"
    /></a>
    <a href="https://www.npmjs.com/package/discordx"
      ><img
        src="https://img.shields.io/npm/v/discordx.svg?maxAge=3600"
        alt="NPM version"
    /></a>
    <a href="https://www.npmjs.com/package/discordx"
      ><img
        src="https://img.shields.io/npm/dt/discordx.svg?maxAge=3600"
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

This module is an extension of **[discord.**js**](https://discordjs.guide/)**, so the internal behavior (methods, properties, ...) is the same.

This library allows you to use TypeScript decorators on discord.**js**, it simplifies your code and improves the readability!

This repository is a ~~fork~~ of [OwenCalvin/discord.ts](https://github.com/OwenCalvin/discord.ts) from [@OwenCalvin](https://github.com/OwenCalvin), which is no longer actively maintained.

# 💻 [Installation](https://discord-ts.js.org/docs/installation)

> Version 16.6.0 or newer of [Node.js](https://nodejs.org/) is required

```
npm install discordx
yarn add discordx
```

> **[installation guide](https://discord-ts.js.org/docs/installation#installation)**

# 📜 Documentation

> **[discord-ts.js.org](https://discord-ts.js.org)**

> **[Tutorials (dev.to)](https://dev.to/oceanroleplay/series/14317)**

# 🤖 Bot Examples

> **[discord.ts-example](https://github.com/oceanroleplay/discord.ts-example)** (starter repo)

> **[discord-music-bot](https://github.com/oceanroleplay/discord-music-bot)** from [@oceanroleplay](https://github.com/oceanroleplay)

> **[WeebBot](https://github.com/VictoriqueMoe/WeebBot)** from [@VictoriqueMoe](https://github.com/VictoriqueMoe)

# 💡 Why discordx?

With `discordx`, we intend to provide the latest up-to-date package to easily build feature-rich bots with multi-bot compatibility, simple commands, pagination, music, and much more. **Updated daily with discord.js changes**.

Try discordx now with [CodeSandbox](https://codesandbox.io/s/github/oceanroleplay/discord.ts-example)

If you have any issues or feature requests, Please open an issue at [Github](https://github.com/oceanroleplay/discord.ts/issues) or join [discord server](https://discord-ts.js.org/discord)

# 🆕 Features

- Support multiple bots in a single nodejs instance (`@Bot`)
- `@SimpleCommand` to use old fashioned command, such as `!hello world`
- `@SimpleCommandOption` parse and define command options like `@SlashOption`
- `client.initApplicationCommands` to create/update/remove discord application commands
- `client.initApplicationPermissions` to update discord application commands permissions
- Handler for all discord interactions (slash/button/menu/context)
- Support TSyringe
- Support ECMAScript

# 🧮 Packages

Here are more packages from us to extend the functionality of your Discord bot.

| Package                                                                        | Description                                                    |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| [`discordx`](https://www.npmjs.com/package/discordx)                           | Create a discord bot with TypeScript and Decorators!           |
| [`@discordx/changelog`](https://www.npmjs.com/package/@discordx/changelog)     | changelog generator, written in TypeScript with Node.js        |
| [`@discordx/di`](https://www.npmjs.com/package/@discordx/di)                   | Dependency injection service with TSyringe support             |
| [`@discordx/importer`](https://www.npmjs.com/package/@discordx/importer)       | Import solution for ESM and CJS                                |
| [`@discordx/internal`](https://www.npmjs.com/package/@discordx/internal)       | discord.ts internal methods, can be used for external projects |
| [`@discordx/koa`](https://www.npmjs.com/package/@discordx/koa)                 | Create rest api server with Typescript and Decorators          |
| [`@discordx/lava-player`](https://www.npmjs.com/package/@discordx/lava-player) | Create lavalink player                                         |
| [`@discordx/music`](https://www.npmjs.com/package/@discordx/music)             | Create discord music player easily                             |
| [`@discordx/pagination`](https://www.npmjs.com/package/@discordx/pagination)   | Add pagination to your discord bot                             |
| [`@discordx/socket.io`](https://www.npmjs.com/package/@discordx/socket.io)     | Create socket.io server with Typescript and Decorators         |
| [`@discordx/utilities`](https://www.npmjs.com/package/@discordx/utilities)     | Create own group with `@Category` and guards                   |
| [`discord-spams`](https://www.npmjs.com/package/discord-spams)                 | Tiny but powerful discord spam protection library              |

# 📔 Decorators

There is a whole system that allows you to implement complex slash/simple commands and handle interactions like button, select menu, contextmenu etc.

## General

- [`@Discord`](https://discord-ts.js.org/docs/decorators/general/discord)
- [`@Guard`](https://discord-ts.js.org/docs/decorators/general/guard)
- [`@Guild`](https://discord-ts.js.org/docs/decorators/general/guild)
- [`@Bot`](https://discord-ts.js.org/docs/decorators/general/bot)
- [`@Permission`](https://discord-ts.js.org/docs/decorators/general/permission)
- [`@On`](https://discord-ts.js.org/docs/decorators/general/on)
- [`@Once`](https://discord-ts.js.org/docs/decorators/general/once)

## Commands

- [`@Slash`](https://discord-ts.js.org/docs/decorators/commands/slash)
- [`@SlashChoice`](https://discord-ts.js.org/docs/decorators/commands/slashchoice)
- [`@SlashGroup`](https://discord-ts.js.org/docs/decorators/commands/slashgroup)
- [`@SlashOption`](https://discord-ts.js.org/docs/decorators/commands/slashoption)
- [`@SimpleCommand`](https://discord-ts.js.org/docs/decorators/commands/simplecommand)
- [`@SimpleCommandOption`](https://discord-ts.js.org/docs/decorators/commands/simplecommandoption)

## GUI Interactions

- [`@ButtonComponent`](https://discord-ts.js.org/docs/decorators/gui/buttoncomponent)
- [`@SelectMenuComponent`](https://discord-ts.js.org/docs/decorators/gui/selectmenucomponent)
- [`@ContextMenu`](https://discord-ts.js.org/docs/decorators/gui/contextmenu)

# 📟 [@Slash](https://discord-ts.js.org/docs/decorators/commands/slash)

Discord has it's own command system now, you can simply declare commands and use Slash commands this way

```ts
import { Discord, Slash } from "discordx";
import { CommandInteraction } from "discord.js";

@Discord()
abstract class AppDiscord {
  @Slash("hello")
  private hello(
    @SlashOption("text")
    text: string,
    interaction: CommandInteraction
  ) {
    // ...
  }
}
```

# 📟 [@ButtonComponent](https://discord-ts.js.org/docs/decorators/gui/buttoncomponent)

create discord button handler with ease!

```ts
@Discord()
class buttonExample {
  @Slash("hello")
  hello(interaction: CommandInteraction) {
    const helloBtn = new MessageButton()
      .setLabel("Hello")
      .setEmoji("👋")
      .setStyle("PRIMARY")
      .setCustomId("hello-btn");

    const row = new MessageActionRow().addComponents(helloBtn);

    interaction.reply({
      content: "Say hello to bot",
      components: [row],
    });
  }

  @ButtonComponent("hello-btn")
  myBtn(interaction: ButtonInteraction) {
    interaction.reply(`👋 ${interaction.member}`);
  }
}
```

# 📟 [@SelectMenuComponent](https://discord-ts.js.org/docs/decorators/gui/selectmenucomponent)

create discord select menu handler with ease!

```ts
const roles = [
  { label: "Principal", value: "principal" },
  { label: "Teacher", value: "teacher" },
  { label: "Student", value: "student" },
];

@Discord()
class buttons {
  @SelectMenuComponent("role-menu")
  async handle(interaction: SelectMenuInteraction) {
    await interaction.deferReply();

    // extract selected value by member
    const roleValue = interaction.values?.[0];

    // if value not found
    if (!roleValue)
      return await interaction.followUp("invalid role id, select again");
    await interaction.followUp(
      `you have selected role: ${
        roles.find((r) => r.value === roleValue).label
      }`
    );
    return;
  }

  @Slash("roles", { description: "role selector menu" })
  async myRoles(interaction: CommandInteraction): Promise<unknown> {
    await interaction.deferReply();

    // create menu for roles
    const menu = new MessageSelectMenu()
      .addOptions(roles)
      .setCustomId("role-menu");

    // create a row for message actions
    const buttonRow = new MessageActionRow().addComponents(menu);

    // send it
    interaction.editReply({
      content: "select your role!",
      components: [buttonRow],
    });
    return;
  }
}
```

# 📟 [@ContextMenu](https://discord-ts.js.org/docs/decorators/gui/contextmenu)

create discord context menu options with ease!

```ts
@Discord()
class contextTest {
  @ContextMenu("MESSAGE", "message context")
  messageHandler(interaction: MessageContextMenuInteraction) {
    console.log("I am message");
  }

  @ContextMenu("USER", "user context")
  userHandler(interaction: UserContextMenuInteraction) {
    console.log("I am user");
  }
}
```

# 📟 [@SimpleCommand](https://discord-ts.js.org/docs/decorators/commands/simplecommand)

Create a simple command handler for messages using `@SimpleCommand`. Example `!hello world`

```ts
@Discord()
class commandTest {
  @SimpleCommand("perm-check", { aliases: ["p-test"] })
  @Permission(false)
  @Permission({
    id: "462341082919731200",
    type: "USER",
    permission: true,
  })
  permFunc(command: SimpleCommandMessage) {
    command.message.reply("access granted");
  }
}
```

# 💡[@On](https://discord-ts.js.org/docs/decorators/general/on) / [@Once](https://discord-ts.js.org/docs/decorators/general/once)

We can declare methods that will be executed whenever a Discord event is triggered.

Our methods must be decorated with the `@On(event: string)` or `@Once(event: string)` decorator.

That's simple, when the event is triggered, the method is called:

```typescript
import { Discord, On, Once } from "discordx";

@Discord()
abstract class AppDiscord {
  @On("messageCreate")
  private onMessage() {
    // ...
  }

  @Once("messageDelete")
  private onMessageDelete() {
    // ...
  }
}
```

# ⚔️ [Guards](https://discord-ts.js.org/docs/decorators/general/guard)

We implemented a guard system thats work pretty like the [Koa](https://koajs.com/) middleware system

You can use functions that are executed before your event to determine if it's executed. For example, if you want to apply a prefix to the messages, you can simply use the `@Guard` decorator.

The order of execution of the guards is done according to their position in the list, so they will be executed in order (from top to bottom).

Guards can be set for `@Slash`, `@On`, `@Once`, `@Discord` and globally.

```typescript
import { Discord, On, Client, Guard } from "discordx";
import { NotBot } from "./NotBot";
import { Prefix } from "./Prefix";

@Discord()
abstract class AppDiscord {
  @On("messageCreate")
  @Guard(
    NotBot // You can use multiple guard functions, they are executed in the same order!
  )
  onMessage([message]: ArgsOf<"messageCreate">) {
    switch (message.content.toLowerCase()) {
      case "hello":
        message.reply("Hello!");
        break;
      default:
        message.reply("Command not found");
        break;
    }
  }
}
```

# ☎️ Need help?

Ask in **[discord server](https://discord-ts.js.org/discord)** or check [code examples](https://github.com/oceanroleplay/discord.ts/tree/main/packages/discordx/examples)

# Thank you

Show your support for [discordx](https://www.npmjs.com/package/discordx) by giving us a star on [github](https://github.com/oceanroleplay/discord.ts).
