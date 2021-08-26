import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash } from "../../../src";
import { sendPaginatedEmbeds } from "../../../packages/utilities/src";

@Discord()
export abstract class StonePaperScissor {
  @Slash("page")
  private async page(interaction: CommandInteraction) {
    const titles = [
      { content: "I am 1", embed: "Demo 1" },
      { content: "I am 2", embed: "Demo 2" },
      { content: "I am 3", embed: "Demo 3" },
    ];
    const embeds = titles.map((title) => {
      return {
        content: title.content,
        embed: new MessageEmbed().setTitle(title.embed),
      };
    });
    await sendPaginatedEmbeds(interaction, embeds, {
      type: "BUTTON",
    });
  }

  @Slash("pagex")
  private async pagex(interaction: CommandInteraction) {
    const titles = [
      { content: "I am 1", embed: "Demo 1" },
      { content: "I am 2", embed: "Demo 2" },
      { content: "I am 3", embed: "Demo 3" },
    ];
    const embeds = titles.map((title) => {
      return {
        content: title.content,
        embed: new MessageEmbed().setTitle(title.embed),
      };
    });
    await sendPaginatedEmbeds(interaction, embeds, {
      type: "SELECT_MENU",
    });
  }
}
