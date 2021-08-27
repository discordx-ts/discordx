import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash } from "../../../../../src";
import { sendPaginatedEmbeds } from "../../../src";

const pages = [
  { content: "I am 0", embed: "Demo 0" },
  { content: "I am 1", embed: "Demo 1" },
  { content: "I am 2", embed: "Demo 2" },
  { content: "I am 3", embed: "Demo 3" },
  { content: "I am 4", embed: "Demo 4" },
  { content: "I am 5", embed: "Demo 5" },
  { content: "I am 6", embed: "Demo 6" },
  { content: "I am 7", embed: "Demo 7" },
  { content: "I am 8", embed: "Demo 8" },
  { content: "I am 9", embed: "Demo 9" },
  { content: "I am 10", embed: "Demo 10" },
  { content: "I am 11", embed: "Demo 11" },
  { content: "I am 12", embed: "Demo 12" },
  { content: "I am 13", embed: "Demo 13" },
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
    await sendPaginatedEmbeds(
      interaction,
      [
        ...embeds,
        ...embeds,
        ...embeds,
        ...embeds,
        ...embeds,
        ...embeds,
        ...embeds,
      ],
      {
        type: "BUTTON",
      }
    );
  }

  @Slash("pagex")
  private async pagex(interaction: CommandInteraction) {
    await sendPaginatedEmbeds(
      interaction,
      [
        ...embeds,
        ...embeds,
        ...embeds,
        ...embeds,
        ...embeds,
        ...embeds,
        ...embeds,
      ],
      {
        type: "SELECT_MENU",
      }
    );
  }
}
