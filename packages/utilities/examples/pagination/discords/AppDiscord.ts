import { ArgsOf, Discord, On, Slash } from "discordx";
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { Pagination, PaginationResolver } from "../../../src";
import { GeneratePages } from "../util/common functions";

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
