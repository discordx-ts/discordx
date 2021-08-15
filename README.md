<p align="center">
  <br/>
  <img src="https://i.imgur.com/kSLOEIF.png" width="150px">
  <br/>
  <br/>
  <h1 align="center">
    <p  align="center">
      discord.ts (discordx)
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

# 🎻 Introduction

This module is an extension of **[discord.**js**](https://discordjs.guide/)**, so the internal behavior (methods, properties, ...) is the same.

This library allows you to use TypeScript decorators on discord.**js**, it simplifies your code and improves the readability!

# 📜 Documentation

**[https://oceanroleplay.github.io/discord.ts/](https://oceanroleplay.github.io/discord.ts/)**

# Why discordx?

For [@typeit/discord](https://www.npmjs.com/package/@typeit/discord), we have created fixes and new features. Likewise, We have also requested our fixes and new features on original package at [OwenCalvin/discord.ts/pull/62](https://github.com/OwenCalvin/discord.ts/pull/62).

But with `discordx` we intend to provide latest upto date package to build bots with many features, such as multi-bot, simple commands, etc.

If you have any issues or feature requests, Open an issue at Github [click here](https://github.com/oceanroleplay/discord.ts/issues)

# New features

- added multiple bot support (`@Bot`)
- added `@SimpleCommand` to support v4 commands
- added new interactions: `@ButtonComponent @SelectMenuComponent` `@ContextMenu`
- added new decorator `@DefaultPermission`
- added new initSlash method to create/update/remove slash commands
- internal source code improved with lint for better type support
- added more example for new decorators

# Package

Maintained by [@oceanroleplay](https://github.com/oceanroleplay)

Package by [@OwenCalvin](https://github.com/OwenCalvin)

---

# 📟 @Slash - Discord commands

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

## Decorators related to slash/simple commands, button, menu and more.

There is a whole system that allows you to implement complex slash/simple commands and handle interactions like button and select menu

- `@Bot`
- `@ButtonComponent`
- `@SelectMenuComponent`
- `@ContextMenu`
- `@Discord`
- `@Guard`
- `@Guild`
- `@On`
- `@Once`
- `@DefaultPermission`
- `@Permission`
- `@SimpleCommand`
- `@SimpleCommandOption`
- `@Slash`
- `@SlashChoice`
- `@SlashGroup`
- `@SlashOption`

# 📟 @ButtonComponent - Discord button component interaction handler

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

# 📟 @SelectMenuComponent - Discord menu component interaction handler

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
    await interaction.defer();

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
    await interaction.defer();

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

# 📟 @SimpleCommand - Command Processor

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
  async permFunc(message: CommandMessage) {
    message.reply("access granted");
  }
}
```

# 💡@On / @Once - Discord events

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

# ⚔️ Guards

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

# 📡 Installation

Use [npm](https://www.npmjs.com/package/discordx) or [yarn](https://yarnpkg.com/package/discordx) to install **discordx** with **discord.js**

**[Please refer to the documentation](https://oceanroleplay.github.io/discord.ts/installation/#installation)**

# ☎️ Need help?

**[discordx server](https://discord.gg/yHQY9fexH9)**

**[discord.ts server](https://discord.gg/VDjwu8E)**

You can also find help with the [examples folder](https://github.com/oceanroleplay/discord.ts/tree/main/examples)

# Thank you
