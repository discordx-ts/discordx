import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash } from "../../../../../src";
import { sendPaginatedEmbeds } from "../../../src";

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
}
