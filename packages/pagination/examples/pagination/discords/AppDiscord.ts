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

import {
  Pagination,
  PaginationResolver,
  PaginationType,
} from "../../../src/index.js";
import { GeneratePages } from "../util/common functions.js";

@Discord()
export abstract class Example {
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
        emoji: { name: "🙂" },
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
        embeds: [new EmbedBuilder({ title: "It's me embed 2" })],
      },
      {
        components: [
          new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            new ButtonBuilder({
              customId: "myCustomId",
              label: "My Custom Button",
              style: ButtonStyle.Primary,
            })
          ),
        ],
        content: "Page 3",
        embeds: [new EmbedBuilder({ title: "It's me embed 3" })],
      },
    ]).send();
  }
}
