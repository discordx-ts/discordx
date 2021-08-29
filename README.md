<div>
  <p align="center">
    <img src="https://oceanroleplay.github.io/discord.ts/discord-ts.svg" width="546" />
  </p>
  <p align="center">
    <a href="https://discord.gg/yHQY9fexH9"
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
  <h1>
    <p align="center">discord.ts (discordx)</p>
  </h1>
  <p align="center">
    <b> Create your discord bot by using TypeScript and decorators! </b>
  </p>
</div>

# 🎻 Introduction

This module is an extension of **[discord.**js**](https://discordjs.guide/)**, so the internal behavior (methods, properties, ...) is the same.

This library allows you to use TypeScript decorators on discord.**js**, it simplifies your code and improves the readability!

# 📜 Documentation

> **[https://oceanroleplay.github.io/discord.ts](https://oceanroleplay.github.io/discord.ts)**

> **[discord.ts-example](https://github.com/oceanroleplay/discord.ts-example)**

> **[Tutorials (dev.to)](https://dev.to/oceanroleplay/series/14317)**

# 💡Why discordx?

~~For [@typeit/discord](https://www.npmjs.com/package/@typeit/discord), we have created fixes and new features. Likewise, We have also requested our fixes and new features on original package at [OwenCalvin/discord.ts/pull/62](https://github.com/OwenCalvin/discord.ts/pull/62).~~

[@typeit/discord](https://www.npmjs.com/package/@typeit/discord) is currently unmaintained (The last update was on June 8, 2021, [see difference](https://github.com/oceanroleplay/discord.ts/graphs/contributors)). At first, this project was only intended for fixes. However, the original source code has been completely recoded and we have also added some new features. Currently, it is not possible to merge this project with the original. Our project code name will remain `discord.ts` since the original is unmaintained. - Harry

With `discordx`, we intend to provide latest upto date package to build bots with many features, such as multi-bot, simple commands, pagination etc.

If you have any issues or feature requests, Please open an issue at [Github](https://github.com/oceanroleplay/discord.ts/issues) or join [discord server](https://discord.gg/yHQY9fexH9)

# 🆕New features

- Support for multiple bots in a single nodejs instance (`@Bot`)
- `@SimpleCommand` to use old fashioned command, such as `!hello world`
- `@SimpleCommandOption` Parse and define command options like `@SlashOption`
- new interactions/decorators: ` @ButtonComponent @SelectMenuComponent @ContextMenu @DefaultPermission`
- New method `client.initApplicationCommands` to create/update/remove discord application commands (slash/context menu) for global and defined guilds
- Lint improved internal source code for better type support
- Provided more examples for new decorators

# 🧮 Packages

Here are more packages from us to extend the functionality of your Discord bot.

| Package                                                                                           | Description                              |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [`@discordx/utilities`](https://github.com/oceanroleplay/discord.ts/tree/main/packages/utilities) | embed pagination with button/select menu |

# 📦 Package

Maintained by [@oceanroleplay](https://github.com/oceanroleplay)

Package by [@OwenCalvin](https://github.com/OwenCalvin)

---

# 📔Decorators

There is a whole system that allows you to implement complex slash/simple commands and handle interactions like button, select menu, contextmenu etc.

#### General

- [`@Discord`](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/discord)
- [`@Guard`](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/guard)
- [`@Guild`](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/guild)
- [`@Bot`](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/bot)
- [`@DefaultPermission`](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/defaultpermission)
- [`@Permission`](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/permission)
- [`@On`](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/on)
- [`@Once`](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/once)

#### Commands

- [`@Slash`](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/slash)
- [`@SlashChoice`](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/slashchoice)
- [`@SlashGroup`](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/slashgroup)
- [`@SlashOption`](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/slashoption)
- [`@SimpleCommand`](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/simplecommand)
- [`@SimpleCommandOption`](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/simplecommandoption)

#### GUI Interactions

- [`@ButtonComponent`](https://oceanroleplay.github.io/discord.ts/docs/decorators/gui/buttoncomponent)
- [`@SelectMenuComponent`](https://oceanroleplay.github.io/discord.ts/docs/decorators/gui/selectmenucomponent)
- [`@ContextMenu`](https://oceanroleplay.github.io/discord.ts/docs/decorators/gui/contextmenu)

# 📟 [@Slash](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/slash) - Discord commands

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

# 📟 [@ButtonComponent](https://oceanroleplay.github.io/discord.ts/docs/decorators/gui/buttoncomponent) - Discord button component interaction handler

add button interaction handler for your bot using `@ButtonComponent` decorator

```ts
@Discord()
class buttonExample {
  @Slash("hello")
  async hello(interaction: CommandInteraction) {
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
  mybtn(interaction: ButtonInteraction) {
    interaction.reply(`👋 ${interaction.member}`);
  }
}
```

# 📟 [@SelectMenuComponent](https://oceanroleplay.github.io/discord.ts/docs/decorators/gui/selectmenucomponent) - Discord menu component interaction handler

add menu interaction handler for your bot using `@SelectMenuComponent` decorator

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
  async myroles(interaction: CommandInteraction): Promise<unknown> {
    await interaction.deferReply();

    // create menu for roels
    const menu = new MessageSelectMenu()
      .addOptions(roles)
      .setCustomId("role-menu");

    // create a row for meessage actions
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

# 📟 [@ContextMenu](https://oceanroleplay.github.io/discord.ts/docs/decorators/gui/contextmenu) - create discord context menu options with ease!

add discord context menu for your bot using `@ContextMenu` decorator

```ts
@Discord()
export abstract class contextTest {
  @ContextMenu("MESSAGE", "message context")
  async messageHandler(interaction: ContextMenuInteraction) {
    console.log("I am message");
  }

  @ContextMenu("USER", "user context")
  async userHandler(interaction: ContextMenuInteraction) {
    console.log("I am user");
  }
}
```

# 📟 [@SimpleCommand](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/simplecommand) - Command Processor

Create a simple command handler for messages using `@SimpleCommand`. Example `!hello world`

```ts
@Discord()
class commandTest {
  @SimpleCommand("permcheck", { aliases: ["ptest"] })
  @DefaultPermission(false)
  @Permission({
    id: "462341082919731200",
    type: "USER",
    permission: true,
  })
  async permFunc(command: SimpleCommandMessage) {
    message.reply("access granted");
  }
}
```

# 💡[@On](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/on) / [@Once](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/once) - Discord events

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

# ⚔️ [Guards](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/guard)

We implemented a guard system thats work pretty like the [Koa](https://koajs.com/) middleware system

You can use functions that are executed before your event to determine if it's executed. For example, if you want to apply a prefix to the messages, you can simply use the `@Guard` decorator.

The order of execution of the guards is done according to their position in the list, so they will be executed in order (from top to bottom).

Guards can be set for `@Slash`, `@On`, `@Once`, `@Discord` and globaly.

```typescript
import { Discord, On, Client, Guard } from "discordx";
import { NotBot } from "./NotBot";
import { Prefix } from "./Prefix";

@Discord()
abstract class AppDiscord {
  @On("messageCreate")
  @Guard(
    NotBot // You can use multiple guard functions, they are excuted in the same order!
  )
  async onMessage([message]: ArgsOf<"messageCreate">) {
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

# 📡 [Installation](https://oceanroleplay.github.io/discord.ts/docs/installation)

Use [npm](https://www.npmjs.com/package/discordx) or [yarn](https://yarnpkg.com/package/discordx) to install **discordx** with **discord.js**

**[Please refer to the documentation](https://oceanroleplay.github.io/discord.ts/installation/#installation)**

# ☎️ Need help?

**[discord server](https://discord.gg/yHQY9fexH9)**

You can also find help with the [examples folder](https://github.com/oceanroleplay/discord.ts/tree/main/examples)

# Thank you

Show your support for this project by giving us a star on [github](https://github.com/oceanroleplay/discord.ts).
