import type { ChatInputCommandInteraction } from "discord.js";
import { ActionRow, ButtonStyle } from "discord.js";
import { ButtonComponent, Embed } from "discord.js";

import type { ArgsOf } from "../../../../discordx/src/index.js";
import { Discord, On, Slash } from "../../../../discordx/src/index.js";
import { Pagination, PaginationResolver } from "../../../src/index.js";
import { GeneratePages } from "../util/common functions.js";

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
  async page(interaction: ChatInputCommandInteraction): Promise<void> {
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
      ephemeral: true,
      onTimeout: () => {
        interaction.deleteReply();
      },
      start: {
        emoji: { name: "🙂" },
      },
      time: 5 * 1000,
      type: "BUTTON",
    });

    await pagination.send();
  }

  // example: simple slash with menu pagination
  @Slash("demob", { description: "Simple slash with menu pagination" })
  pagex(interaction: ChatInputCommandInteraction): void {
    new Pagination(interaction, GeneratePages(), {
      type: "SELECT_MENU",
    }).send();
  }

  // example: simple string array
  @Slash("democ", { description: "Simple string array" })
  pages(interaction: ChatInputCommandInteraction): void {
    new Pagination(
      interaction,
      Array.from(Array(20).keys()).map((i) => i.toString())
    ).send();
  }

  // example: array of custom message options
  @Slash("demod", { description: "Array of custom message options" })
  pagen(interaction: ChatInputCommandInteraction): void {
    new Pagination(interaction, [
      {
        content: "Page 1",
      },
      {
        content: "Page 2",
        embeds: [new Embed({ title: "It's me embed 2" })],
      },
      {
        components: [
          new ActionRow().addComponents(
            new ButtonComponent()
              .setCustomId("myCustomId")
              .setLabel("My Custom Botton")
              .setStyle(ButtonStyle.Primary)
          ),
        ],
        content: "Page 3",
        embeds: [new Embed({ title: "It's me embed 3" })],
      },
    ]).send();
  }
}
