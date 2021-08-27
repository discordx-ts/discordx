# @discordx/utilities - Embed Pagination

- Embed pagination with discord's new buttons and select menu
- fully customizable (You can open an issue if you find something missing, so that we can fix it)
- Large list support (for examples 1000 items)
- Support content only pagination (`string[]`)

![discord embed pagination](https://github.com/oceanroleplay/discord.ts/raw/main/packages/utilities/images/discord-embed-pagination.jpg)

# Example

```ts
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash } from "discordx";
import { sendPaginatedEmbeds } from "@discordx/utilities";

const pages = [
  { content: "I am 1", embed: "Demo 1" },
  { content: "I am 2", embed: "Demo 2" },
  { content: "I am 3", embed: "Demo 3" },
];

const embeds = pages.map((page) => {
  return {
    content: page.content,
    embed: new MessageEmbed().setTitle(page.embed),
  };
});

@Discord()
export abstract class StonePaperScissor {
  @Slash("page")
  private async page(interaction: CommandInteraction) {
    await sendPaginatedEmbeds(interaction, embeds, {
      type: "BUTTON",
    });
  }

  @Slash("pagex")
  private async pagex(interaction: CommandInteraction) {
    await sendPaginatedEmbeds(interaction, embeds, {
      type: "SELECT_MENU",
    });
  }

  @Slash("pages")
  private async pages(interaction: CommandInteraction) {
    await sendPaginatedEmbeds(
      interaction,
      Array.from(Array(20).keys()).map((i) => i.toString())
    );
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

# Thank you
