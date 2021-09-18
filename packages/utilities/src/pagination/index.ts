import {
  Interaction,
  Message,
  MessageEmbed,
  MessageOptions,
  TextBasedChannels,
} from "discord.js";
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
  sendTo: PaginationInteractions | Message | TextBasedChannels,
  embeds: (string | MessageEmbed | MessageOptions)[],
  options?: PaginationOptions
): Promise<void> {
  const option =
    options ??
    (embeds.length < 20 ? { type: "BUTTON" } : { type: "SELECT_MENU" });
  let currentPage = option.initialPage ?? 0;

  const allPages = embeds.map((embed, index) =>
    GeneratePage(embed, index, embeds.length, option)
  );

  const replyOptions = allPages[currentPage];
  if (!replyOptions) {
    throw Error("Pagination: out of bound page");
  }

  let message: Message;

  if (sendTo instanceof Message) {
    message = await sendTo.reply(replyOptions);
  } else if (sendTo instanceof Interaction) {
    const reply =
      sendTo.deferred || sendTo.replied
        ? await sendTo.followUp({
            ...replyOptions,
            fetchReply: true,
          })
        : await sendTo.reply({
            ...replyOptions,
            fetchReply: true,
          });

    if (!(reply instanceof Message)) {
      throw Error("InvalidMessage instance");
    }

    message = reply;
  } else {
    message = await sendTo.send(replyOptions);
  }

  // check if pages sent
  if (!message) {
    throw Error("Pagination: Failed to send pages");
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
      if (!messageOptions) {
        throw Error("Pagination: out of bound page");
      }
      await collectInteraction.editReply(messageOptions);
    }
    if (
      collectInteraction.isSelectMenu() &&
      option.type === "SELECT_MENU" &&
      collectInteraction.customId === (option.menuId ?? defaultIds.menuId)
    ) {
      await collectInteraction.deferUpdate();

      if (currentPage) {
        currentPage = Number(collectInteraction.values[0] ?? "0");
      }

      if (currentPage === -1) {
        currentPage = 0;
      }

      if (currentPage === -2) {
        currentPage = embeds.length - 1;
      }

      const replyOptionsEx = allPages[currentPage];
      if (!replyOptionsEx) {
        throw Error("Pagination: out of bound page");
      }
      await collectInteraction.editReply(replyOptionsEx);
    }
  });

  collector.on("end", async () => {
    if (!message.editable || message.deleted) {
      return;
    }

    await message.edit({ components: [] });
  });
}
