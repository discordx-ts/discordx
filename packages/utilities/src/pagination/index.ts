import { Message, MessageEmbed, MessageOptions } from "discord.js";
import {
  PaginationInteractions,
  PaginationOptions,
  defaultIds,
  defaultTime,
} from "./types";
import { GeneratePage } from "./functions/GeneratePage";

/**
 * send paginated embeds
 * @param interaction
 * @param embeds
 * @param options
 */
export async function sendPaginatedEmbeds(
  interaction: PaginationInteractions,
  embeds: (string | MessageEmbed | MessageOptions)[],
  options?: PaginationOptions
): Promise<void> {
  const option = options ?? { type: "BUTTON" };
  let currentPage = option.initialPage ?? 0;

  const allPages = embeds.map((embed, index) =>
    GeneratePage(embed, index, embeds.length, option)
  );

  const replyOptions = allPages[currentPage];
  const message =
    interaction.deferred || interaction.replied
      ? await interaction.followUp({
          ...replyOptions,
          ephemeral: option.ephemeral,
          fetchReply: true,
        })
      : await interaction.reply({
          ...replyOptions,
          ephemeral: option.ephemeral,
          fetchReply: true,
        });

  if (!(message instanceof Message)) {
    throw Error("InvalidMessage instance");
  }

  const collector = message.createMessageComponentCollector({
    time: option.time ?? defaultTime,
  });

  collector.on("collect", async (collectInteraction) => {
    if (collectInteraction.isButton() && option.type === "BUTTON") {
      if (
        collectInteraction.customId ===
        (option.startId ?? defaultIds.startButton)
      ) {
        currentPage = 0;
      } else if (
        collectInteraction.customId === (option.endId ?? defaultIds.endButton)
      ) {
        currentPage = embeds.length - 1;
      } else if (
        collectInteraction.customId === (option.nextId ?? defaultIds.nextButton)
      ) {
        currentPage++;
      } else if (
        collectInteraction.customId ===
        (option.previousId ?? defaultIds.previousButton)
      ) {
        currentPage--;
      } else {
        return;
      }

      await collectInteraction.deferUpdate();
      const messageOptions = allPages[currentPage];
      if (!messageOptions) throw Error("out of bound page");
      await collectInteraction.editReply(messageOptions);
    }
    if (
      collectInteraction.isSelectMenu() &&
      option.type === "SELECT_MENU" &&
      collectInteraction.customId === (option.menuId ?? defaultIds.menuId)
    ) {
      await collectInteraction.deferUpdate();
      currentPage = Number(collectInteraction.values[0] ?? "0");
      if (currentPage === -1) currentPage = 0;
      if (currentPage === -2) currentPage = embeds.length - 1;

      const replyOptions = allPages[currentPage];
      if (!replyOptions) throw Error("out of bound page");
      await collectInteraction.editReply(replyOptions);
    }
  });

  collector.on("end", async () => {
    if (!message.editable || message.deleted) {
      return;
    }

    await message.edit({ components: [] });
  });
}
