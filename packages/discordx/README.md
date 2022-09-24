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

This module is an extension of **[discord.**js**](https://discord.js.org)**, so the internal behavior (methods, properties, ...) is the same.

This library allows you to use TypeScript decorators on discord.**js**, it simplifies your code and improves the readability!

# 💻 [Installation](https://discordx.js.org/docs/discordx/getting-started)

> Version 16.6.0 or newer of [Node.js](https://nodejs.org/) is required

```
npm install discordx
yarn add discordx
```

> **[installation guide](https://discordx.js.org/docs/discordx/getting-started#installation)**

> **[one-click installation](https://github.com/discordx-ts/discordx/tree/main/packages/create-discordx#-introduction)**

# 📜 Documentation

> **[discordx.js.org](https://discordx.js.org)**

> **[Tutorials (dev.to)](https://dev.to/oceanroleplay/series/14317)**

# 🤖 Bot Examples

> **[discordx-templates](https://github.com/discordx-ts/templates)** (starter repo)

> **[music bot (ytdl)](https://github.com/discordx-ts/templates/tree/main/4-music-player-ytdl)**

> **[lavalink bot](https://github.com/discordx-ts/templates/tree/main/5-music-player-lavalink)**

> **[Shana](https://github.com/VictoriqueMoe/Shana)** from [@VictoriqueMoe](https://github.com/VictoriqueMoe)

# 💡 Why discordx?

With `discordx`, we intend to provide the latest up-to-date package to easily build feature-rich bots with multi-bot compatibility, simple commands, pagination, music, and much more. **Updated daily with discord.js changes**.

Try discordx now with [CodeSandbox](https://codesandbox.io/s/github/discordx-ts/templates)

If you have any issues or feature requests, Please open an issue at [GitHub](https://github.com/discordx-ts/discordx/issues) or join [discord server](https://discordx.js.org/discord)

# 🆕 Features

- Support multiple bots in a single nodejs instance (`@Bot`)
- `@SimpleCommand` to use old fashioned command, such as `!hello world`
- `@SimpleCommandOption` parse and define command options like `@SlashOption`
- `client.initApplicationCommands` to create/update/remove discord application commands
- Handler for all discord interactions (slash/button/menu/context)
- Support TSyringe and TypeDI
- Support ECMAScript

# 🧮 Packages

Here are more packages from us to extend the functionality of your Discord bot.

| Package                                                                        | Description                                                  |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| [`create-discordx`](https://www.npmjs.com/package/discordx)                    | Create discordx apps with one command                        |
| [`discordx`](https://www.npmjs.com/package/discordx)                           | Create a discord bot with TypeScript and Decorators!         |
| [`@discordx/changelog`](https://www.npmjs.com/package/@discordx/changelog)     | Changelog generator, written in TypeScript with Node.js      |
| [`@discordx/di`](https://www.npmjs.com/package/@discordx/di)                   | Dependency injection service with TSyringe support           |
| [`@discordx/importer`](https://www.npmjs.com/package/@discordx/importer)       | Import solution for ESM and CJS                              |
| [`@discordx/internal`](https://www.npmjs.com/package/@discordx/internal)       | discordx internal methods, can be used for external projects |
| [`@discordx/koa`](https://www.npmjs.com/package/@discordx/koa)                 | Create rest api server with Typescript and Decorators        |
| [`@discordx/lava-player`](https://www.npmjs.com/package/@discordx/lava-player) | Create lavalink player                                       |
| [`@discordx/lava-queue`](https://www.npmjs.com/package/@discordx/lava-queue)   | Create queue system for lavalink player                      |
| [`@discordx/music`](https://www.npmjs.com/package/@discordx/music)             | Create discord music player easily                           |
| [`@discordx/pagination`](https://www.npmjs.com/package/@discordx/pagination)   | Add pagination to your discord bot                           |
| [`@discordx/socket.io`](https://www.npmjs.com/package/@discordx/socket.io)     | Create socket.io server with Typescript and Decorators       |
| [`@discordx/utilities`](https://www.npmjs.com/package/@discordx/utilities)     | Create own group with `@Category` and guards                 |
| [`discord-spams`](https://www.npmjs.com/package/discord-spams)                 | Tiny but powerful discord spam protection library            |

# 📔 Decorators

There is a whole system that allows you to implement complex slash/simple commands and handle interactions like button, select-menu, context-menu etc.

## General

- [`@Discord`](https://discordx.js.org/docs/discordx/decorators/general/discord)
- [`@Guard`](https://discordx.js.org/docs/discordx/decorators/general/guard)
- [`@Guild`](https://discordx.js.org/docs/discordx/decorators/general/guild)
- [`@Bot`](https://discordx.js.org/docs/discordx/decorators/general/bot)
- [`@On`](https://discordx.js.org/docs/discordx/decorators/general/on)
- [`@Once`](https://discordx.js.org/docs/discordx/decorators/general/once)
- [`@Once`](https://discordx.js.org/docs/discordx/decorators/general/once)
- [`@Reaction`](https://discordx.js.org/docs/discordx/decorators/general/reaction)

## Commands

- [`@Slash`](https://discordx.js.org/docs/discordx/decorators/command/slash)
- [`@SlashChoice`](https://discordx.js.org/docs/discordx/decorators/command/slash-choice)
- [`@SlashGroup`](https://discordx.js.org/docs/discordx/decorators/command/slash-group)
- [`@SlashOption`](https://discordx.js.org/docs/discordx/decorators/command/slash-option)
- [`@SimpleCommand`](https://discordx.js.org/docs/discordx/decorators/command/simple-command)
- [`@SimpleCommandOption`](https://discordx.js.org/docs/discordx/decorators/command/simple-command-option)

## GUI Interactions

- [`@ButtonComponent`](https://discordx.js.org/docs/discordx/decorators/gui/button-component)
- [`@ContextMenu`](https://discordx.js.org/docs/discordx/decorators/gui/context-menu)
- [`@ModalComponent`](https://discordx.js.org/docs/discordx/decorators/gui/modal-component)
- [`@SelectMenuComponent`](https://discordx.js.org/docs/discordx/decorators/gui/select-menu-component)

# 📟 [@Slash](https://discordx.js.org/docs/discordx/decorators/command/slash)

Discord has it's own command system now, you can simply declare commands and use Slash commands this way

```ts
@Discord()
class Example {
  @Slash({ description: "say hello", name: "hello" })
  hello(
    @SlashOption({
      description: "enter your greeting",
      name: "message",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    message: string,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`:wave: from ${interaction.user}: ${message}`);
  }
}
```

# 📟 [@ButtonComponent](https://discordx.js.org/docs/discordx/decorators/gui/button-component)

Create discord button handler with ease!

```ts
@Discord()
class Example {
  @ButtonComponent({ id: "hello" })
  handler(interaction: ButtonInteraction): void {
    interaction.reply(":wave:");
  }

  @ButtonComponent({ id: "hello" })
  handler2(interaction: ButtonInteraction): void {
    console.log(`${interaction.user} says hello`);
  }

  @Slash({ description: "test" })
  test(interaction: CommandInteraction): void {
    const btn = new ButtonBuilder()
      .setLabel("Hello")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("hello");

    const buttonRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        btn
      );

    interaction.reply({
      components: [buttonRow],
    });
  }
}
```

# 📟 [@SelectMenuComponent](https://discordx.js.org/docs/discordx/decorators/gui/select-menu-component)

Create discord select menu handler with ease!

```ts
const roles = [
  { label: "Principal", value: "principal" },
  { label: "Teacher", value: "teacher" },
  { label: "Student", value: "student" },
];

@Discord()
class Example {
  @SelectMenuComponent({ id: "role-menu" })
  async handle(interaction: SelectMenuInteraction): Promise<unknown> {
    await interaction.deferReply();

    // extract selected value by member
    const roleValue = interaction.values?.[0];

    // if value not found
    if (!roleValue) {
      return interaction.followUp("invalid role id, select again");
    }

    interaction.followUp(
      `you have selected role: ${
        roles.find((r) => r.value === roleValue)?.label ?? "unknown"
      }`
    );
    return;
  }

  @Slash({ description: "roles menu", name: "my-roles" })
  async myRoles(interaction: CommandInteraction): Promise<unknown> {
    await interaction.deferReply();

    // create menu for roles
    const menu = new SelectMenuBuilder()
      .addOptions(roles)
      .setCustomId("role-menu");

    // create a row for message actions
    const buttonRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        menu
      );

    // send it
    interaction.editReply({
      components: [buttonRow],
      content: "select your role!",
    });
    return;
  }
}
```

# 📟 [@ContextMenu](https://discordx.js.org/docs/discordx/decorators/gui/context-menu)

Create discord context menu options with ease!

```ts
@Discord()
class Example {
  @ContextMenu({
    name: "Hello from discordx",
    type: ApplicationCommandType.Message,
  })
  messageHandler(interaction: MessageContextMenuCommandInteraction): void {
    console.log("I am message");
    interaction.reply("message interaction works");
  }

  @ContextMenu({
    name: "Hello from discordx",
    type: ApplicationCommandType.User,
  })
  userHandler(interaction: UserContextMenuCommandInteraction): void {
    console.log(`Selected user: ${interaction.targetId}`);
    interaction.reply("user interaction works");
  }
}
```

# 📟 [@ModalComponent](https://discordx.js.org/docs/discordx/decorators/gui/modal-component)

Create discord modal with ease!

```ts
@Discord()
class Example {
  @Slash({ description: "modal" })
  modal(interaction: CommandInteraction): void {
    // Create the modal
    const modal = new ModalBuilder()
      .setTitle("My Awesome Form")
      .setCustomId("AwesomeForm");

    // Create text input fields
    const tvShowInputComponent = new TextInputBuilder()
      .setCustomId("tvField")
      .setLabel("Favorite TV show")
      .setStyle(TextInputStyle.Short);

    const haikuInputComponent = new TextInputBuilder()
      .setCustomId("haikuField")
      .setLabel("Write down your favorite haiku")
      .setStyle(TextInputStyle.Paragraph);

    const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(
      tvShowInputComponent
    );

    const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(
      haikuInputComponent
    );

    // Add action rows to form
    modal.addComponents(row1, row2);

    // --- snip ---

    // Present the modal to the user
    interaction.showModal(modal);
  }

  @ModalComponent()
  async AwesomeForm(interaction: ModalSubmitInteraction): Promise<void> {
    const [favTVShow, favHaiku] = ["tvField", "haikuField"].map((id) =>
      interaction.fields.getTextInputValue(id)
    );

    await interaction.reply(
      `Favorite TV Show: ${favTVShow}, Favorite haiku: ${favHaiku}`
    );

    return;
  }
}
```

# 📟 [@SimpleCommand](https://discordx.js.org/docs/discordx/decorators/command/simple-command)

Create a simple command handler for messages using `@SimpleCommand`. Example `!hello world`

```ts
@Discord()
class Example {
  @SimpleCommand({ aliases: ["hey", "hi"], name: "hello" })
  hello(command: SimpleCommandMessage): void {
    command.message.reply(":wave:");
  }
}
```

# 💡[@On](https://discordx.js.org/docs/discordx/decorators/general/on) / [@Once](https://discordx.js.org/docs/discordx/decorators/general/once)

We can declare methods that will be executed whenever a Discord event is triggered.

Our methods must be decorated with the `@On(event: string)` or `@Once(event: string)` decorator.

That's simple, when the event is triggered, the method is called:

```typescript
@Discord()
class Example {
  @On({ name: "messageCreate" })
  messageCreate() {
    // ...
  }

  @Once({ name: "messageDelete" })
  messageDelete() {
    // ...
  }
}
```

# 💡[@Reaction](https://discordx.js.org/docs/discordx/decorators/general/reaction)

Create a reaction handler for messages using `@Reaction`.

```typescript
@Discord()
class Example {
  @Reaction({ emoji: "⭐", remove: true })
  async starReaction(reaction: MessageReaction, user: User): Promise<void> {
    await reaction.message.reply(`Received a ${reaction.emoji} from ${user}`);
  }

  @Reaction({ aliases: ["📍", "custom_emoji"], emoji: "📌" })
  async pin(reaction: MessageReaction): Promise<void> {
    await reaction.message.pin();
  }
}
```

# ⚔️ [Guards](https://discordx.js.org/docs/discordx/decorators/general/guard)

We implemented a guard system that functions like the [Koa](https://koajs.com/) middleware system

You can use functions that are executed before your event to determine if it's executed. For example, if you want to apply a prefix to the messages, you can simply use the `@Guard` decorator.

The order of execution of the guards is done according to their position in the list, so they will be executed in order (from top to bottom).

Guards can be set for `@Slash`, `@On`, `@Once`, `@Discord` and globally.

```typescript
import { Discord, On, Client, Guard } from "discordx";
import { NotBot } from "./NotBot";
import { Prefix } from "./Prefix";

@Discord()
class Example {
  @On()
  @Guard(
    NotBot // You can use multiple guard functions, they are executed in the same order!
  )
  messageCreate([message]: ArgsOf<"messageCreate">) {
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

# 📜 Documentation

- [discordx.js.org](https://discordx.js.org)
- [Tutorials (dev.to)](https://dev.to/oceanroleplay/series/14317)

# ☎️ Need help?

- [Check frequently asked questions](https://discordx.js.org/docs/faq)
- [Check examples](https://github.com/discordx-ts/discordx/tree/main/packages/discordx/examples)
- Ask in the community [Discord server](https://discordx.js.org/discord)

# 💖 Thank you

You can support [discordx](https://www.npmjs.com/package/discordx) by giving it a [GitHub](https://github.com/discordx-ts/discordx) star.
