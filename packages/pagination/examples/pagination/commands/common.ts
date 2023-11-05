import {
  Pagination,
  PaginationResolver,
  PaginationType,
} from "@discordx/pagination";
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

import { GeneratePages } from "../util/common functions.js";

@Discord()
export class Example {
  // example: message
  @On({ event: "messageCreate" })
  messageCreate([message]: ArgsOf<"messageCreate">): void {
    if (message.content === "paginated demo") {
      new Pagination(message, GeneratePages(), {
        type: PaginationType.Button,
      }).send();
    }
  }

  // example: any text channel
  @On({ event: "messageCreate" })
  messageCreateChannel([message]: ArgsOf<"messageCreate">): void {
    if (message.content === "paginated channel demo") {
      new Pagination(message.channel, GeneratePages(), {
        type: PaginationType.Button,
      }).send();
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
      onTimeout: () => interaction.deleteReply(),
      start: {
        emoji: { name: "🙂" },
      },
      time: 5 * 1000,
      type: PaginationType.Button,
    });

    await pagination.send();
  }

  // example: simple slash with menu pagination
  @Slash({ description: "Simple slash with menu pagination", name: "demo-b" })
  demoB(interaction: CommandInteraction): void {
    new Pagination(interaction, GeneratePages(), {
      time: 5 * 1000,
      type: PaginationType.SelectMenu,
    }).send();
  }

  // example: simple string array
  @Slash({ description: "Simple string array", name: "demo-c" })
  demoC(interaction: CommandInteraction): void {
    new Pagination(
      interaction,
      Array.from(Array(20).keys()).map((i) => ({ content: i.toString() })),
    ).send();
  }

  // example: array of custom message options
  @Slash({ description: "Array of custom message options", name: "demo-d" })
  demoD(interaction: CommandInteraction): void {
    new Pagination(interaction, [
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
    ]).send();
  }
}
