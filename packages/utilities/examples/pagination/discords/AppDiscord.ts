import { ArgsOf, Discord, On, Slash } from "discordx";
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { GeneratePages } from "../util/common functions";
import { sendPaginatedEmbeds } from "../../../src";

@Discord()
export abstract class Example {
  // example: message
  @On("messageCreate")
  onMessage([message]: ArgsOf<"messageCreate">): void {
    if (message.content === "paginated demo") {
      sendPaginatedEmbeds(message, GeneratePages(), {
        type: "BUTTON",
      });
    }
  }

  // example: any text channel
  @On("messageCreate")
  onMessageChannel([message]: ArgsOf<"messageCreate">): void {
    if (message.content === "paginated channel demo") {
      sendPaginatedEmbeds(message.channel, GeneratePages(), {
        type: "BUTTON",
      });
    }
  }

  // example: simple slash with button pagination
  @Slash("demoa", { description: "Simple slash with button pagination" })
  page(interaction: CommandInteraction): void {
    sendPaginatedEmbeds(interaction, GeneratePages(), {
      type: "BUTTON",
    });
  }

  // example: simple slash with menu pagination
  @Slash("demob", { description: "Simple slash with menu pagination" })
  pagex(interaction: CommandInteraction): void {
    sendPaginatedEmbeds(interaction, GeneratePages(), {
      type: "SELECT_MENU",
    });
  }

  // example: simple string array
  @Slash("democ", { description: "Simple string array" })
  pages(interaction: CommandInteraction): void {
    sendPaginatedEmbeds(
      interaction,
      Array.from(Array(20).keys()).map((i) => i.toString())
    );
  }

  // example: array of custom message options
  @Slash("demod", { description: "Array of custom message options" })
  pagen(interaction: CommandInteraction): void {
    sendPaginatedEmbeds(interaction, [
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
    ]);
  }
}
