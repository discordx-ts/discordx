<div>
  <p align="center">
    <img src="https://discord-ts.js.org/discord-ts.svg" width="546" />
  </p>
  <p align="center">
    <a href="https://discord.gg/yHQY9fexH9"
      ><img
        src="https://img.shields.io/discord/874802018361950248?color=5865F2&logo=discord&logoColor=white"
        alt="Discord server"
    /></a>
    <a href="https://www.npmjs.com/package/@discordx/utilities"
      ><img
        src="https://img.shields.io/npm/v/@discordx/utilities.svg?maxAge=3600"
        alt="NPM version"
    /></a>
    <a href="https://www.npmjs.com/package/@discordx/utilities"
      ><img
        src="https://img.shields.io/npm/dt/@discordx/utilities.svg?maxAge=3600"
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

# @discordx/utilities

Add useful features to discordx, If a feature isn't available, request it.

- [@Category](#category-decorator)
- [Pagination](#pagination)

# 💻 Installation

Version 16.6.0 or newer of Node.js is required

```
npm install @discordx/utilities
yarn add @discordx/utilities
```

# Category Decorator

## Example

```ts
@Discord()
@Category("Admin Commands", "Commands for server admin")
@Category("Admin Commands", [
  { description: " kick a user", name: "kick", options: [], type: "SLASH" },
  { description: " ban a user", name: "ban", options: [], type: "SLASH" },
])
class SlashExample {
  // commands
}
```

```ts
// Access data from anywhere
import { CategoryMetaData } from "@discord/utilities";

CategoryMetaData.categories; // access categories metadata
```

# Pagination

- Embed pagination with discord's new buttons and select menu
- fully customizable (You can open an issue if you find something missing, so that we can fix it)
- Large list support (for examples 1000 items)
- Support (`embeds: (string | MessageEmbed | MessageOptions)[] | Pagination`)
- support interaction/message/channel to send pages
- page resolver for dynamic usage

![discord embed pagination](https://github.com/oceanroleplay/discord.ts/raw/main/packages/utilities/images/discord-embed-pagination.jpg)

## Example

```ts
import type { ArgsOf } from "discordx";
import { Discord, On, Slash } from "discordx";
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { Pagination, PaginationResolver } from "@discordx/utilities";

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
export abstract class Example {
  // example: message
  @On("messageCreate")
  onMessage([message]: ArgsOf<"messageCreate">): void {
    if (message.content === "paginated demo") {
      new Pagination(message, GeneratePages(), {
        type: "BUTTON",
      }).send();
    }
  }

  // example: any text channel
  @On("messageCreate")
  onMessageChannel([message]: ArgsOf<"messageCreate">): void {
    if (message.content === "paginated channel demo") {
      new Pagination(message.channel, GeneratePages(), {
        type: "BUTTON",
      }).send();
    }
  }

  // example: simple slash with button pagination
  @Slash("demoa", { description: "Simple slash with button pagination" })
  async page(interaction: CommandInteraction): Promise<void> {
    const embedx = new PaginationResolver((page, pagination) => {
      if (page === 3) {
        // example to replace pagination with another pagination data
        pagination.currentPage = 0; // reset current page, because this is gonna be first page
        pagination.maxLength = 5; // new max length for new paginations
        pagination.embeds = ["1", "2", "3", "4", "5"]; // page reference can be resolver as well
        return pagination.embeds[pagination.currentPage] ?? "unknown"; // the first page, must select ourselve
      }
      return `page v2 ${page}`;
    }, 25);

    const pagination = new Pagination(interaction, embedx, {
      type: "BUTTON",
    });

    await pagination.send();
  }

  // example: simple slash with menu pagination
  @Slash("demob", { description: "Simple slash with menu pagination" })
  pagex(interaction: CommandInteraction): void {
    new Pagination(interaction, GeneratePages(), {
      type: "SELECT_MENU",
    }).send();
  }

  // example: simple string array
  @Slash("democ", { description: "Simple string array" })
  pages(interaction: CommandInteraction): void {
    new Pagination(
      interaction,
      Array.from(Array(20).keys()).map((i) => i.toString())
    ).send();
  }

  // example: array of custom message options
  @Slash("demod", { description: "Array of custom message options" })
  pagen(interaction: CommandInteraction): void {
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
              label: "My Custom Botton",
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

# Installation

> NPM

```
npm install @discordx/utilities discord.js
```

> yarn

```
yarn add @discordx/utilities discord.js
```

# Options

| Name         | Type                  | Default   | Description                  |
| ------------ | --------------------- | --------- | ---------------------------- |
| enableExit   | boolean               | false     | Enable early exit pagination |
| ephemeral    | boolean               | undefined | Enable ephemeral             |
| initialPage  | number                | 0         | Initial page                 |
| onTimeout    | Function              | undefined | Timeout callback             |
| showStartEnd | boolean               | true      | Show start/end               |
| time         | number                | 18e5      | Timeout for pagination in ms |
| type         | BUTTON \| SELECT_MENU | BUTTON    | Pagination type              |

> When pagination options are not defined, SELECT_MENU will be used if there are more than 20 pages.

## Button Options

The following options are only available, if you have set type to `BUTTON`

| Name     | Type          | Default   | Description    |
| -------- | ------------- | --------- | -------------- |
| end      | ButtonOptions | undefined | Button options |
| exit     | ButtonOptions | undefined | Button options |
| next     | ButtonOptions | undefined | Button options |
| previous | ButtonOptions | undefined | Button options |
| start    | ButtonOptions | undefined | Button options |

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

# Thank you

Show your support for this project by giving us a star on [github](https://github.com/oceanroleplay/discord.ts).
