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

![discord embed pagination](https://github.com/discordx-ts/discordx/raw/main/packages/pagination/images/discord-embed-pagination.jpg)

## Example

```ts
import { Pagination, PaginationResolver } from "@discordx/pagination";
import type {
  CommandInteraction,
  MessageActionRowComponentBuilder,
} from "discord.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import type { ArgsOf } from "discordx";
import { Discord, On, Slash } from "discordx";

function GeneratePages(limit?: number): MessageOptions[] {
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
export class Example {
  // example: message
  @On({ event: "messageCreate" })
  async messageCreate([message]: ArgsOf<"messageCreate">): Promise<void> {
    if (message.content === "paginated demo") {
      const pagination = new Pagination(message, GeneratePages());
      await pagination.send();
    }
  }

  // example: any text channel
  @On({ event: "messageCreate" })
  async messageCreateChannel([
    message,
  ]: ArgsOf<"messageCreate">): Promise<void> {
    if (message.content === "paginated channel demo") {
      const pagination = new Pagination(message.channel, GeneratePages());
      await pagination.send();
    }
  }

  // example: simple slash with button pagination
  @Slash({ description: "Simple slash with button pagination", name: "demo-a" })
  async demoA(interaction: CommandInteraction): Promise<void> {
    const embedX = new PaginationResolver((page, pagination) => {
      if (page === 3) {
        // example to replace pagination with another pagination data
        pagination.currentPage = 0; // reset current page, because this is gonna be first page
        pagination.maxLength = 5; // new max length for new pagination
        pagination.pages = [
          { content: "1" },
          { content: "2" },
          { content: "3" },
          { content: "4" },
          { content: "5" },
        ]; // page reference can be resolver as well

        return (
          pagination.pages[pagination.currentPage] ?? { content: "unknown" }
        ); // the first page, must select ourselves
      }
      return { content: `page v2 ${page}` };
    }, 25);

    const pagination = new Pagination(interaction, embedX, {
      onTimeout: () => {
        void interaction.deleteReply().catch(null);
      },
      buttons: {
        backward: {
          emoji: { name: "🙂" },
        },
      },
      time: 60_000,
    });

    await pagination.send();
  }

  // example: simple slash with menu pagination
  @Slash({ description: "Simple slash with menu pagination", name: "demo-b" })
  async demoB(interaction: CommandInteraction): Promise<void> {
    const pagination = new Pagination(interaction, GeneratePages(), {
      time: 60_000,
    });

    await pagination.send();
  }

  // example: simple string array
  @Slash({ description: "Simple string array", name: "demo-c" })
  async demoC(interaction: CommandInteraction): Promise<void> {
    const pagination = new Pagination(
      interaction,
      Array.from(Array(200).keys()).map((i) => ({
        content: (i + 1).toString(),
      })),
    );

    await pagination.send();
  }

  // example: array of custom message options
  @Slash({ description: "Array of custom message options", name: "demo-d" })
  async demoD(interaction: CommandInteraction): Promise<void> {
    const pagination = new Pagination(interaction, [
      {
        content: "Page 1",
      },
      {
        content: "Page 2",
        embeds: [new EmbedBuilder({ title: "It's me embed 2" })],
      },
      {
        components: [
          new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            [
              new ButtonBuilder({
                customId: "myCustomId",
                label: "My Custom Button",
                style: ButtonStyle.Primary,
              }),
            ],
          ),
        ],
        content: "Page 3",
        embeds: [new EmbedBuilder({ title: "It's me embed 3" })],
      },
    ]);

    await pagination.send();
  }
}
```

# Options

## Basic Options

| Name         | Type     | Default   | Description                                   |
| ------------ | -------- | --------- | --------------------------------------------- |
| debug        | boolean  | false     | Enable debug logging                          |
| ephemeral    | boolean  | undefined | Set ephemeral response                        |
| initialPage  | number   | 0         | Initial page number                           |
| itemsPerPage | number   | undefined | Number of items shown per page in select menu |
| onTimeout    | Function | undefined | Callback function when pagination times out   |

## Button Navigation Options

The following options are available under the `buttons` configuration:

| Name       | Type          | Description                                             |
| ---------- | ------------- | ------------------------------------------------------- |
| previous   | ButtonOptions | Previous button configuration                           |
| backward   | ButtonOptions | Backward button configuration (-10 pages)               |
| forward    | ButtonOptions | Forward button configuration (+10 pages)                |
| next       | ButtonOptions | Next button configuration                               |
| exit       | ButtonOptions | Exit button configuration                               |
| skipAmount | number        | Number of pages to skip with skip buttons (default: 10) |

### ButtonOptions Structure

| Name    | Type                             | Description                                        |
| ------- | -------------------------------- | -------------------------------------------------- |
| enabled | Boolean                          | Show button in row                                 |
| emoji   | ComponentEmojiResolvable \| null | Button emoji                                       |
| id      | string                           | Custom button ID                                   |
| label   | string                           | Button label text                                  |
| style   | ButtonStyle                      | Button style (PRIMARY\|SECONDARY\|SUCCESS\|DANGER) |

## Select Menu Options

The following options are available under the `selectMenu` configuration:

| Name                   | Type               | Default                    | Description                                                         |
| ---------------------- | ------------------ | -------------------------- | ------------------------------------------------------------------- |
| labels.start           | string             | "Start"                    | Start label text                                                    |
| labels.end             | string             | "End"                      | End label text                                                      |
| menuId                 | string             | "discordx@pagination@menu" | Custom select menu ID                                               |
| pageText               | string \| string[] | "Page `{page}`"            | Page text format (use `{page}` for page number)                     |
| rangePlaceholderFormat | string             | undefined                  | Custom range placeholder format (use `{start}`, `{end}`, `{total}`) |

# 📜 Documentation

- [discordx.js.org](https://discordx.js.org)
- [Tutorials (dev.to)](https://dev.to/vijayymmeena/series/14317)

# ☎️ Need help?

- [Check frequently asked questions](https://discordx.js.org/docs/faq)
- [Check examples](https://github.com/discordx-ts/discordx/tree/main/packages/discordx/examples)
- Ask in the community [Discord server](https://discordx.js.org/discord)

# 💖 Thank you

You can support [discordx](https://www.npmjs.com/package/discordx) by giving it a [GitHub](https://github.com/discordx-ts/discordx) star.
