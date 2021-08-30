import { ArgsOf, Discord, On, Slash } from "../../../../../src";
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageOptions,
} from "discord.js";
import { sendPaginatedEmbeds } from "../../../src";

function embeds(): MessageOptions[] {
  const pages = Array.from(Array(20).keys()).map((i) => {
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
export abstract class StonePaperScissor {
  // example: message
  @On("messageCreate")
  async onMessage([message]: ArgsOf<"messageCreate">): Promise<void> {
    if (message.content === "paginated demo") {
      await sendPaginatedEmbeds(message, embeds(), {
        type: "BUTTON",
      });
    }
  }

  // example: any text channel
  @On("messageCreate")
  async onMessageChannel([message]: ArgsOf<"messageCreate">): Promise<void> {
    if (message.content === "paginated channel demo") {
      await sendPaginatedEmbeds(message.channel, embeds(), {
        type: "BUTTON",
      });
    }
  }

  // example: simple slash with button pagination
  @Slash("demoA")
  async page(interaction: CommandInteraction): Promise<void> {
    await sendPaginatedEmbeds(interaction, embeds(), {
      type: "BUTTON",
    });
  }

  // example: simple slash with menu pagination
  @Slash("demoB")
  async pagex(interaction: CommandInteraction): Promise<void> {
    await sendPaginatedEmbeds(interaction, embeds(), {
      type: "SELECT_MENU",
    });
  }

  // example: simple string array
  @Slash("demoC")
  async pages(interaction: CommandInteraction): Promise<void> {
    await sendPaginatedEmbeds(
      interaction,
      Array.from(Array(20).keys()).map((i) => i.toString())
    );
  }

  // example: array of custom message options
  @Slash("demoD")
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
