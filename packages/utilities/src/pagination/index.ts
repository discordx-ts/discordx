import * as _ from "lodash";
import {
  Interaction,
  InteractionReplyOptions,
  Message,
  MessageActionRow,
  TextBasedChannels,
} from "discord.js";
import {
  PaginationInteractions,
  PaginationOptions,
  defaultIds,
  defaultTime,
  embedType,
  paginationFunc,
} from "./types";
import { GeneratePage } from "./functions/GeneratePage";

export class PaginationResolver {
  constructor(public resolver: paginationFunc, public maxLength: number) {}
}

export class Pagination {
  maxLength: number;
  currentPage: number;
  option: PaginationOptions;

  constructor(
    public sendTo: PaginationInteractions | Message | TextBasedChannels,
    public embeds: embedType[] | PaginationResolver,
    config?: PaginationOptions
  ) {
    /**
     * page length of pagination
     */
    this.maxLength =
      embeds instanceof PaginationResolver ? embeds.maxLength : embeds.length;

    /**
     * default options
     */
    this.option =
      config ??
      (this.maxLength < 20 ? { type: "BUTTON" } : { type: "SELECT_MENU" });

    /**
     * Current page
     */
    this.currentPage = config?.initialPage ?? 0;
  }

  getPage = async (
    page: number
  ): Promise<
    | {
        paginationRow: MessageActionRow;
        replyOptions: InteractionReplyOptions;
      }
    | undefined
  > => {
    const embed =
      this.embeds instanceof PaginationResolver
        ? await this.embeds.resolver(page, this)
        : _.cloneDeep(this.embeds[page]);

    if (!embed) {
      return undefined;
    }
    return GeneratePage(embed, this.currentPage, this.maxLength, this.option);
  };

  async send(): Promise<Message> {
    // prepare intial message
    const page = await this.getPage(this.currentPage);
    if (!page) {
      throw Error("Pagination: out of bound page");
    }

    if (page.replyOptions.components) {
      page.replyOptions.components.push(page.paginationRow);
    } else {
      page.replyOptions.components = [page.paginationRow];
    }

    let message: Message;

    // send embed
    if (this.sendTo instanceof Message) {
      message = await this.sendTo.reply(page.replyOptions);
    } else if (this.sendTo instanceof Interaction) {
      const reply =
        this.sendTo.deferred || this.sendTo.replied
          ? await this.sendTo.followUp({
              ...page.replyOptions,
              ephemeral: this.option.ephemeral,
              fetchReply: true,
            })
          : await this.sendTo.reply({
              ...page.replyOptions,
              ephemeral: this.option.ephemeral,
              fetchReply: true,
            });

      if (!(reply instanceof Message)) {
        throw Error("InvalidMessage instance");
      }

      message = reply;
    } else {
      message = await this.sendTo.send(page.replyOptions);
    }

    // check if pages sent
    if (!message) {
      throw Error("Pagination: Failed to send pages");
    }

    // create collector
    const collector = message.createMessageComponentCollector({
      time: this.option.time ?? defaultTime,
    });

    collector.on("collect", async (collectInteraction) => {
      if (collectInteraction.isButton() && this.option.type === "BUTTON") {
        if (
          collectInteraction.customId ===
          (this.option.startId ?? defaultIds.startButton)
        ) {
          this.currentPage = 0;
        } else if (
          collectInteraction.customId ===
          (this.option.endId ?? defaultIds.endButton)
        ) {
          this.currentPage = this.maxLength - 1;
        } else if (
          collectInteraction.customId ===
          (this.option.nextId ?? defaultIds.nextButton)
        ) {
          this.currentPage++;
        } else if (
          collectInteraction.customId ===
          (this.option.previousId ?? defaultIds.previousButton)
        ) {
          this.currentPage--;
        } else {
          return;
        }

        await collectInteraction.deferUpdate();

        const pageEx = await this.getPage(this.currentPage);
        if (!pageEx) {
          throw Error("Pagination: out of bound page");
        }
        if (pageEx.replyOptions.components) {
          pageEx.replyOptions.components.push(pageEx.paginationRow);
        } else {
          pageEx.replyOptions.components = [pageEx.paginationRow];
        }
        await collectInteraction.editReply(pageEx.replyOptions);
      }
      if (
        collectInteraction.isSelectMenu() &&
        this.option.type === "SELECT_MENU" &&
        collectInteraction.customId ===
          (this.option.menuId ?? defaultIds.menuId)
      ) {
        await collectInteraction.deferUpdate();

        // eslint-disable-next-line require-atomic-updates
        this.currentPage = Number(collectInteraction.values[0]) ?? 0;

        if (this.currentPage === -1) {
          this.currentPage = 0;
        }

        if (this.currentPage === -2) {
          this.currentPage = this.maxLength - 1;
        }

        const pageEx = await this.getPage(this.currentPage);
        if (!pageEx) {
          throw Error("Pagination: out of bound page");
        }
        if (pageEx.replyOptions.components) {
          pageEx.replyOptions.components.push(pageEx.paginationRow);
        } else {
          pageEx.replyOptions.components = [pageEx.paginationRow];
        }
        await collectInteraction.editReply(pageEx.replyOptions);
      }
    });

    collector.on("end", async () => {
      const finalPage = await this.getPage(this.currentPage);
      if (message.editable && finalPage) {
        await message.edit(finalPage.replyOptions);
      }

      if (this.option.onPaginationTimeout) {
        this.option.onPaginationTimeout(this.currentPage, message);
      }
    });

    return message;
  }
}
