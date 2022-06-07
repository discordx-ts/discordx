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
    <a href="https://www.npmjs.com/package/@discordx/pagination"
      ><img
        src="https://img.shields.io/npm/v/@discordx/pagination.svg?maxAge=3600"
        alt="NPM version"
    /></a>
    <a href="https://www.npmjs.com/package/@discordx/pagination"
      ><img
        src="https://img.shields.io/npm/dt/@discordx/pagination.svg?maxAge=3600"
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

Add pagination to discord bot using buttons or menu.

# 💻 Installation

Version 16.6.0 or newer of Node.js is required

```
npm install @discordx/pagination
yarn add @discordx/pagination
```

# Pagination

- Embed pagination with discord's new buttons and select menu
- fully customizable (You can open an issue if you find something missing, so that we can fix it)
- Large list support (for examples 1000 items)
- Support (`embeds: (string | MessageEmbed | MessageOptions)[] | Pagination`)
- support interaction/message/channel to send pages
- page resolver for dynamic usage

![discord embed pagination](https://github.com/oceanroleplay/discord.ts/raw/main/packages/pagination/images/discord-embed-pagination.jpg)

## Example

```ts
import {
  Pagination,
  PaginationResolver,
  PaginationType,
} from "@discordx/pagination";
import type { CommandInteraction, MessageOptions } from "discord.js";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import type { ArgsOf } from "discordx";
import { Discord, On, Slash } from "discordx";

export function GeneratePages(limit?: number): MessageOptions[] {
  const pages = Array.from(Array(limit ?? 20).keys()).map((i) => {
    return { content: `I am ${i + 1}`, embed: `Demo ${i + 1}` };
  });
  return pages.map((page) => {
    return {
      content: page.content,
      embeds: [new MessageEmbed().setTitle(page.embed)],
    };
  });
}

@Discord()
class Example {
  // example: message
  @On("messageCreate")
  onMessage([message]: ArgsOf<"messageCreate">): void {
    if (message.content === "paginated demo") {
      new Pagination(message, GeneratePages(), {
        type: PaginationType.Button,
      }).send();
    }
  }

  // example: any text channel
  @On("messageCreate")
  onMessageChannel([message]: ArgsOf<"messageCreate">): void {
    if (message.content === "paginated channel demo") {
      new Pagination(message.channel, GeneratePages(), {
        type: PaginationType.Button,
      }).send();
    }
  }

  // example: simple slash with button pagination
  @Slash("demo-a", { description: "Simple slash with button pagination" })
  async demoA(interaction: CommandInteraction): Promise<void> {
    const embedX = new PaginationResolver((page, pagination) => {
      if (page === 3) {
        // example to replace pagination with another pagination data
        pagination.currentPage = 0; // reset current page, because this is gonna be first page
        pagination.maxLength = 5; // new max length for new pagination
        pagination.embeds = ["1", "2", "3", "4", "5"]; // page reference can be resolver as well
        return pagination.embeds[pagination.currentPage] ?? "unknown"; // the first page, must select ourselves
      }
      return `page v2 ${page}`;
    }, 25);

    const pagination = new Pagination(interaction, embedX, {
      ephemeral: true,
      onTimeout: () => {
        interaction.deleteReply();
      },
      start: {
        emoji: "🙂",
      },
      time: 5 * 1000,
      type: PaginationType.Button,
    });

    await pagination.send();
  }

  // example: simple slash with menu pagination
  @Slash("demo-b", { description: "Simple slash with menu pagination" })
  demoB(interaction: CommandInteraction): void {
    new Pagination(interaction, GeneratePages(), {
      type: PaginationType.SelectMenu,
    }).send();
  }

  // example: simple string array
  @Slash("demo-c", { description: "Simple string array" })
  demoC(interaction: CommandInteraction): void {
    new Pagination(
      interaction,
      Array.from(Array(20).keys()).map((i) => i.toString())
    ).send();
  }

  // example: array of custom message options
  @Slash("demo-d", { description: "Array of custom message options" })
  demoD(interaction: CommandInteraction): void {
    new Pagination(interaction, [
      {
        content: "Page 1",
      },
      {
        content: "Page 2",
        embeds: [new MessageEmbed({ title: "It's me embed 2" })],
      },
      {
        components: [
          new MessageActionRow().addComponents([
            new MessageButton({
              customId: "myCustomId",
              label: "My Custom Button",
              style: "PRIMARY",
            }),
          ]),
        ],
        content: "Page 3",
        embeds: [new MessageEmbed({ title: "It's me embed 3" })],
      },
    ]).send();
  }
}
```

# Options

| Name         | Type              | Default   | Description                  |
| ------------ | ----------------- | --------- | ---------------------------- |
| enableExit   | boolean           | false     | Enable early exit pagination |
| ephemeral    | boolean           | undefined | Enable ephemeral             |
| initialPage  | number            | 0         | Initial page                 |
| onTimeout    | Function          | undefined | Timeout callback             |
| showStartEnd | boolean \| number | true      | Show start/end               |
| time         | number            | 3e5       | Timeout for pagination in ms |
| type         | PaginationType    | BUTTON    | Pagination type              |

> When pagination options are not defined, SELECT_MENU will be used if there are more than 20 pages.

## Button Options

The following options are only available, if you have set type to `BUTTON`

| Name     | Type          | Description             |
| -------- | ------------- | ----------------------- |
| end      | ButtonOptions | End Button options      |
| exit     | ButtonOptions | Exit Button options     |
| next     | ButtonOptions | Next Button options     |
| previous | ButtonOptions | Previous Button options |
| start    | ButtonOptions | Start Button options    |

## Type: ButtonOptions

| Name  | Type                                    | Description  |
| ----- | --------------------------------------- | ------------ |
| emoji | EmojiIdentifierResolvable               | Button Emoji |
| id    | string                                  | Button Id    |
| label | string                                  | Button Label |
| style | PRIMARY\| SECONDARY \|SUCCESS \| DANGER | Button Style |

## SELECT_MENU Options

The following options are only available, if you have set type to `SELECT_MENU`

| Name         | Type               | Default                  | Description      |
| ------------ | ------------------ | ------------------------ | ---------------- |
| labels.end   | string             | End                      | label            |
| labels.exit  | string             | Exit Pagination          | label            |
| labels.start | string             | Start                    | label            |
| menuId       | string             | discordx@pagination@menu | Menu custom id   |
| pageText     | string \| string[] | Page {page}              | Menu page text   |
| placeholder  | string             | Select page              | Menu placeholder |

# ☎️ Need help?

Ask in **[discord server](https://discord-ts.js.org/discord)** or open a **[issue](https://github.com/oceanroleplay/discord.ts/issues)**

# Thank you

Show your support for [discordx](https://www.npmjs.com/package/discordx) by giving us a star on [github](https://github.com/oceanroleplay/discord.ts).
