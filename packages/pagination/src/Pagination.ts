import type {
  CacheType,
  InteractionCollector,
  TextBasedChannel,
} from "discord.js";
import {
  CommandInteraction,
  ContextMenuInteraction,
  Interaction,
  Message,
  MessageComponentInteraction,
} from "discord.js";
import _ from "lodash";

import { GeneratePage } from "./functions/GeneratePage.js";
import type { PaginationResolver } from "./Resolver.js";
import type {
  IGeneratePage,
  PaginationInteractions,
  PaginationItem,
  PaginationOptions,
} from "./types.js";
import { defaultIds, defaultTime } from "./types.js";

export class Pagination<T extends PaginationResolver = PaginationResolver> {
  public maxLength: number;
  public currentPage: number;
  public option: PaginationOptions;
  public collector?: InteractionCollector<
    MessageComponentInteraction<CacheType>
  >;
  public message?: Message;
  private _isSent = false;
  private _isFollowUp = false;

  get isSent(): boolean {
    return this._isSent;
  }

  constructor(
    public sendTo: PaginationInteractions | Message | TextBasedChannel,
    public embeds: PaginationItem[] | T,
    config?: PaginationOptions
  ) {
    /**
     * page length of pagination
     */
    this.maxLength = Array.isArray(embeds) ? embeds.length : embeds.maxLength;

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

    /**
     * Since direct editing isn't available on ephemeral, disable exit mode
     */
    if (this.option.ephemeral && this.option.enableExit) {
      throw Error("Ephemeral pagination does not support exit mode");
    }
  }

  /**
   * Get page
   * @param page
   * @returns
   */
  public getPage = async (page: number): Promise<IGeneratePage | undefined> => {
    const embed = Array.isArray(this.embeds)
      ? _.cloneDeep<PaginationItem | undefined>(this.embeds[page])
      : await this.embeds.resolver(page, this);

    if (!embed) {
      return undefined;
    }
    return GeneratePage(embed, this.currentPage, this.maxLength, this.option);
  };

  /**
   * Send pagination
   * @returns
   */
  public async send(): Promise<{
    collector: InteractionCollector<MessageComponentInteraction<CacheType>>;
    message: Message;
  }> {
    if (this._isSent) {
      throw Error("Pagination: already sent");
    }

    // prepare intial message
    const page = await this.getPage(this.currentPage);
    if (!page) {
      throw Error("Pagination: out of bound page");
    }

    if (page.newMessage.components) {
      page.newMessage.components.push(page.paginationRow);
    } else {
      page.newMessage.components = [page.paginationRow];
    }

    let message: Message;

    // send embed
    if (this.sendTo instanceof Message) {
      message = await this.sendTo.reply(page.newMessage);
    } else if (
      this.sendTo instanceof CommandInteraction ||
      this.sendTo instanceof MessageComponentInteraction ||
      this.sendTo instanceof ContextMenuInteraction
    ) {
      // To ensure pagination is a follow-up
      if (this.sendTo.deferred || this.sendTo.replied) {
        this._isFollowUp = true;
      }

      const reply =
        this.sendTo.deferred || this.sendTo.replied
          ? await this.sendTo.followUp({
              ...page.newMessage,
              ephemeral: this.option.ephemeral,
              fetchReply: true,
            })
          : await this.sendTo.reply({
              ...page.newMessage,
              ephemeral: this.option.ephemeral,
              fetchReply: true,
            });

      if (!(reply instanceof Message)) {
        throw Error("InvalidMessage instance");
      }

      message = reply;
    } else {
      message = await this.sendTo.send(page.newMessage);
    }

    // Check if pages were sent
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
          (this.option.exit?.id ?? defaultIds.buttons.exit)
        ) {
          collector.stop();
          return;
        } else if (
          collectInteraction.customId ===
          (this.option.start?.id ?? defaultIds.buttons.start)
        ) {
          this.currentPage = 0;
        } else if (
          collectInteraction.customId ===
          (this.option.end?.id ?? defaultIds.buttons.end)
        ) {
          this.currentPage = this.maxLength - 1;
        } else if (
          collectInteraction.customId ===
          (this.option.next?.id ?? defaultIds.buttons.next)
        ) {
          this.currentPage++;
        } else if (
          collectInteraction.customId ===
          (this.option.previous?.id ?? defaultIds.buttons.previous)
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

        if (pageEx.newMessage.components) {
          pageEx.newMessage.components.push(pageEx.paginationRow);
        } else {
          pageEx.newMessage.components = [pageEx.paginationRow];
        }

        await collectInteraction.editReply(pageEx.newMessage);
      }
      if (
        collectInteraction.isSelectMenu() &&
        this.option.type === "SELECT_MENU" &&
        collectInteraction.customId === (this.option.menuId ?? defaultIds.menu)
      ) {
        await collectInteraction.deferUpdate();

        const menuValue = Number(collectInteraction.values[0]) ?? 0;

        if (menuValue === -3) {
          collector.stop();
          return;
        }

        if (menuValue === -1) {
          this.currentPage = 0;
        }

        if (menuValue === -2) {
          this.currentPage = this.maxLength - 1;
        }

        this.currentPage = menuValue;

        const pageEx = await this.getPage(this.currentPage);
        if (!pageEx) {
          throw Error("Pagination: out of bound page");
        }

        if (pageEx.newMessage.components) {
          pageEx.newMessage.components.push(pageEx.paginationRow);
        } else {
          pageEx.newMessage.components = [pageEx.paginationRow];
        }

        await collectInteraction.editReply(pageEx.newMessage);
      }
    });

    collector.on("end", async () => {
      const finalPage = await this.getPage(this.currentPage);
      if (message.editable && finalPage) {
        if (!finalPage.newMessage.components) {
          finalPage.newMessage.components = [];
        }

        // Prevent ephemeral pagination error, since direct editing is not available
        if (this.option.ephemeral && this.sendTo instanceof Interaction) {
          if (!this._isFollowUp) {
            await this.sendTo.editReply(finalPage.newMessage);
          }
        } else {
          await message.edit(finalPage.newMessage);
        }
      }

      if (this.option.onTimeout) {
        this.option.onTimeout(this.currentPage, message);
      }
    });

    this.collector = collector;
    this.message = message;
    this._isSent = true;

    return { collector, message };
  }
}
