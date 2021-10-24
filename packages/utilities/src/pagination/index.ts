import * as _ from "lodash";
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
): Promise<Message> {
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
      embeds instanceof Pagination
        ? await embeds.func(page)
        : _.cloneDeep(embeds[page]);
    if (!embed) {
      return undefined;
    }
    return GeneratePage(embed, page, maxLength, option);
  };

  // prepare intial message
  const page = await getPage(currentPage);
  if (!page) {
    throw Error("Pagination: out of bound page");
  }

  let message: Message;

  // send embed
  if (sendTo instanceof Message) {
    message = await sendTo.reply(page);
  } else if (sendTo instanceof Interaction) {
    const reply =
      sendTo.deferred || sendTo.replied
        ? await sendTo.followUp({
            ...page,
            ephemeral: options?.ephemeral,
            fetchReply: true,
          })
        : await sendTo.reply({
            ...page,
            ephemeral: options?.ephemeral,
            fetchReply: true,
          });

    if (!(reply instanceof Message)) {
      throw Error("InvalidMessage instance");
    }

    message = reply;
  } else {
    message = await sendTo.send(page);
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

      const pageEx = await getPage(currentPage);
      if (!pageEx) {
        throw Error("Pagination: out of bound page");
      }
      await collectInteraction.editReply(pageEx);
    }
    if (
      collectInteraction.isSelectMenu() &&
      option.type === "SELECT_MENU" &&
      collectInteraction.customId === (option.menuId ?? defaultIds.menuId)
    ) {
      await collectInteraction.deferUpdate();

      // eslint-disable-next-line require-atomic-updates
      currentPage = Number(collectInteraction.values[0]) ?? 0;

      if (currentPage === -1) {
        currentPage = 0;
      }

      if (currentPage === -2) {
        currentPage = maxLength - 1;
      }

      const pageEx = await getPage(currentPage);
      if (!pageEx) {
        throw Error("Pagination: out of bound page");
      }
      await collectInteraction.editReply(pageEx);
    }
  });

  collector.on("end", async () => {
    if (!message.editable || message.deleted) {
      return;
    }

    await message.edit({ components: [] });

    if (options?.onPaginationTimeout) {
      options?.onPaginationTimeout(currentPage);
    }
  });

  return message;
}
