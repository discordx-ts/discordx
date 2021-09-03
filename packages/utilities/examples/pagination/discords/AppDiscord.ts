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
  async onMessage([message]: ArgsOf<"messageCreate">): Promise<void> {
    if (message.content === "paginated demo") {
      await sendPaginatedEmbeds(message, GeneratePages(), {
        type: "BUTTON",
      });
    }
  }

  // example: any text channel
  @On("messageCreate")
  async onMessageChannel([message]: ArgsOf<"messageCreate">): Promise<void> {
    if (message.content === "paginated channel demo") {
      await sendPaginatedEmbeds(message.channel, GeneratePages(), {
        type: "BUTTON",
      });
    }
  }

  // example: simple slash with button pagination
  @Slash("demoa", { description: "Simple slash with button pagination" })
  async page(interaction: CommandInteraction): Promise<void> {
    await sendPaginatedEmbeds(interaction, GeneratePages(), {
      type: "BUTTON",
    });
  }

  // example: simple slash with menu pagination
  @Slash("demob", { description: "Simple slash with menu pagination" })
  async pagex(interaction: CommandInteraction): Promise<void> {
    await sendPaginatedEmbeds(interaction, GeneratePages(), {
      type: "SELECT_MENU",
    });
  }

  // example: simple string array
  @Slash("democ", { description: "Simple string array" })
  async pages(interaction: CommandInteraction): Promise<void> {
    await sendPaginatedEmbeds(
      interaction,
      Array.from(Array(20).keys()).map((i) => i.toString())
    );
  }

  // example: array of custom message options
  @Slash("demod", { description: "Array of custom message options" })
  async pagen(interaction: CommandInteraction): Promise<void> {
    await sendPaginatedEmbeds(interaction, [
      {
        content: "Page 1",
      },
      {
        content: "Page 2",
        embeds: [new MessageEmbed({ title: "It's me embed 2" })],
      },
      {
        content: "Page 3",
        embeds: [new MessageEmbed({ title: "It's me embed 3" })],
        components: [
          new MessageActionRow().addComponents([
            new MessageButton({
              customId: "myCustomId",
              style: "PRIMARY",
              label: "My Custom Botton",
            }),
          ]),
        ],
      },
    ]);
  }
}
