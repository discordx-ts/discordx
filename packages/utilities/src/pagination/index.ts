import { Interaction, Message, TextBasedChannels } from "discord.js";
import {
  PaginationInteractions,
  PaginationOptions,
  defaultIds,
  defaultTime,
  embedType,
  paginationFunc,
} from "./types";
import { GeneratePage } from "./functions/GeneratePage";

export class Pagination {
  func: paginationFunc;
  maxLength: number;

  constructor(resolver: paginationFunc, maxLength: number) {
    this.func = resolver;
    this.maxLength = maxLength;
  }
}

/**
 * send paginated embeds
 * @param interaction
 * @param embeds
 * @param options
 */
export async function sendPaginatedEmbeds(
  sendTo: PaginationInteractions | Message | TextBasedChannels,
  embeds: embedType[] | Pagination,
  options?: PaginationOptions
): Promise<void> {
  // max length
  const maxLength =
    embeds instanceof Pagination ? embeds.maxLength : embeds.length;

  if (maxLength < 1) {
    throw Error("Pagination: invalid max length");
  }

  // default options
  const option =
    options ?? (maxLength < 20 ? { type: "BUTTON" } : { type: "SELECT_MENU" });

  // current page
  let currentPage = option.initialPage ?? 0;

  // get page
  const getPage = async (page: number) => {
    const embed =
      embeds instanceof Pagination ? await embeds.func(page) : embeds[page];
    if (!embed) {
      return undefined;
    }
    return GeneratePage(embed, page, maxLength, option);
  };

  // prepare intial message
  const replyOptions = await getPage(currentPage);
  if (!replyOptions) {
    throw Error("Pagination: out of bound page");
  }

  let message: Message;

  // send embed
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

  // create collector
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
        currentPage = maxLength - 1;
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

      const messageOptions = await getPage(currentPage);
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
        currentPage = maxLength - 1;
      }

      const replyOptionsEx = await getPage(currentPage);
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
