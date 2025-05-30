/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type {
  ButtonInteraction,
  InteractionCollector,
  StringSelectMenuInteraction,
} from "discord.js";
import {
  ChannelType,
  ChatInputCommandInteraction,
  CommandInteraction,
  ComponentType,
  ContextMenuCommandInteraction,
  Message,
  MessageComponentInteraction,
} from "discord.js";
import cloneDeep from "lodash/cloneDeep.js";

import { GeneratePage } from "./functions/GeneratePage.js";
import type { PaginationResolver } from "./Resolver.js";
import type {
  IGeneratePage,
  PaginationItem,
  PaginationOptions,
  PaginationSendTo,
} from "./types.js";
import {
  defaultIds,
  defaultTime,
  PaginationType,
  SelectMenuPageId,
} from "./types.js";

export class Pagination<T extends PaginationResolver = PaginationResolver> {
  public maxLength: number;
  public currentPage: number;
  public option: PaginationOptions;
  public collector?: InteractionCollector<
    ButtonInteraction | StringSelectMenuInteraction
  >;

  public message?: Message;
  private _isSent = false;
  private _isFollowUp = false;

  get isSent(): boolean {
    return this._isSent;
  }

  constructor(
    public sendTo: PaginationSendTo,
    public pages: PaginationItem[] | T,
    config?: PaginationOptions,
  ) {
    /**
     * page length of pagination
     */
    this.maxLength = Array.isArray(pages) ? pages.length : pages.maxLength;

    /**
     * default options
     */
    this.option =
      config ??
      (this.maxLength < 20
        ? { type: PaginationType.Button }
        : { type: PaginationType.SelectMenu });

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
   * Unable to update pagination error
   */
  private unableToUpdate(): void {
    if (this.option.debug) {
      console.log("pagination: unable to update pagination");
    }
  }

  /**
   * Get page
   *
   * @param page
   *
   * @returns
   */
  public getPage = async (page: number): Promise<IGeneratePage | null> => {
    const embed = Array.isArray(this.pages)
      ? cloneDeep<PaginationItem | undefined>(this.pages[page])
      : await this.pages.resolver(page, this);

    if (!embed) {
      return null;
    }

    return GeneratePage(embed, this.currentPage, this.maxLength, this.option);
  };

  /**
   * Send pagination
   * @returns
   */
  public async send(): Promise<{
    collector: InteractionCollector<
      ButtonInteraction | StringSelectMenuInteraction
    >;
    message: Message;
  }> {
    // If pagination has already been sent, throw an error
    if (this._isSent) {
      throw Error("Pagination: has already been sent");
    }

    // Prepare initial message
    const page = await this.getPage(this.currentPage);
    if (!page) {
      throw Error("Pagination: out of bound page");
    }

    // Add a pagination row to components
    if (page.newMessage.components) {
      page.newMessage.components = [
        ...page.newMessage.components,
        page.paginationRow,
      ];
    } else {
      page.newMessage.components = [page.paginationRow];
    }

    let message: Message;

    // Send embed
    if (this.sendTo instanceof Message) {
      message = await this.sendTo.reply(page.newMessage);
    } else if (
      this.sendTo instanceof CommandInteraction ||
      this.sendTo instanceof MessageComponentInteraction ||
      this.sendTo instanceof ContextMenuCommandInteraction
    ) {
      // To ensure pagination is a follow-up
      if (this.sendTo.deferred || this.sendTo.replied) {
        this._isFollowUp = true;
      }

      // send message
      let reply: Message | null = null;

      if (this.sendTo.deferred || this.sendTo.replied) {
        reply = await this.sendTo.followUp({
          ...page.newMessage,
          ephemeral: this.option.ephemeral,
          fetchReply: true,
        });
      } else {
        const response = await this.sendTo.reply({
          ...page.newMessage,
          ephemeral: this.option.ephemeral,
          withResponse: true,
        });

        reply = response.resource?.message ?? null;
      }

      // If the message response is not received, throw an error
      if (!reply) {
        throw Error(
          "Missing Intent: GUILD_MESSAGES\nWithout guild message intent, pagination does not work, Consider adding GUILD_MESSAGES as an intent\nread more at https://discordx.js.org/docs/faq/Errors/Pagination#missing-intent-guild_messages",
        );
      }

      message = reply;
    } else {
      if (this.sendTo.type === ChannelType.GuildStageVoice) {
        throw Error("Pagination not supported with guild stage channel");
      }

      message = await this.sendTo.send(page.newMessage);
    }

    // create collector
    const collector = message.createMessageComponentCollector({
      ...this.option,
      componentType:
        this.option.type === PaginationType.Button
          ? ComponentType.Button
          : ComponentType.StringSelect,
      time: this.option.time ?? defaultTime,
    });

    /**
     * Reset collector timer
     */
    const resetCollectorTimer = () => {
      collector.resetTimer({
        idle: this.option.idle,
        time: this.option.time ?? defaultTime,
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    collector.on("collect", async (collectInteraction) => {
      if (
        collectInteraction.isButton() &&
        this.option.type === PaginationType.Button
      ) {
        if (
          collectInteraction.customId ===
          (this.option.exit?.id ?? defaultIds.buttons.exit)
        ) {
          // Exit pagination if exit is requested
          collector.stop();
          return;
        } else if (
          collectInteraction.customId ===
          (this.option.start?.id ?? defaultIds.buttons.start)
        ) {
          // Requested start page
          this.currentPage = 0;
        } else if (
          collectInteraction.customId ===
          (this.option.end?.id ?? defaultIds.buttons.end)
        ) {
          // Requested end page
          this.currentPage = this.maxLength - 1;
        } else if (
          collectInteraction.customId ===
          (this.option.next?.id ?? defaultIds.buttons.next)
        ) {
          // Requested next page
          if (this.currentPage < this.maxLength - 1) {
            this.currentPage++;
          }
        } else if (
          collectInteraction.customId ===
          (this.option.previous?.id ?? defaultIds.buttons.previous)
        ) {
          // Requested previous page
          if (this.currentPage > 0) {
            this.currentPage--;
          }
        } else {
          return;
        }

        await collectInteraction.deferUpdate();
        resetCollectorTimer();

        // Get page
        const pageEx = await this.getPage(this.currentPage);
        if (!pageEx) {
          throw Error("Pagination: out of bound page");
        }

        // Add pagination row
        if (pageEx.newMessage.components) {
          pageEx.newMessage.components = [
            ...pageEx.newMessage.components,
            pageEx.paginationRow,
          ];
        } else {
          pageEx.newMessage.components = [pageEx.paginationRow];
        }

        // Update message
        await collectInteraction.editReply(pageEx.newMessage).catch(() => {
          this.unableToUpdate();
        });
      } else if (
        collectInteraction.isStringSelectMenu() &&
        this.option.type === PaginationType.SelectMenu &&
        collectInteraction.customId === (this.option.menuId ?? defaultIds.menu)
      ) {
        await collectInteraction.deferUpdate();
        resetCollectorTimer();

        this.currentPage = Number(collectInteraction.values[0] ?? 0);

        // Exit pagination if exit is requested
        if (this.currentPage === Number(SelectMenuPageId.Exit)) {
          collector.stop();
          return;
        }

        // Requested start page
        if (this.currentPage === Number(SelectMenuPageId.Start)) {
          this.currentPage = 0;
        }

        // Requested end page
        if (this.currentPage === Number(SelectMenuPageId.End)) {
          this.currentPage = this.maxLength - 1;
        }

        // Update page
        const pageEx = await this.getPage(this.currentPage);
        if (!pageEx) {
          throw Error("Pagination: out of bound page");
        }

        if (pageEx.newMessage.components) {
          pageEx.newMessage.components = [
            ...pageEx.newMessage.components,
            pageEx.paginationRow,
          ];
        } else {
          pageEx.newMessage.components = [pageEx.paginationRow];
        }

        await collectInteraction.editReply(pageEx.newMessage).catch(() => {
          this.unableToUpdate();
        });
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    collector.on("end", async () => {
      const finalPage = await this.getPage(this.currentPage);
      if (message.editable && finalPage) {
        // Reset page components
        finalPage.newMessage.components ??= [];

        // Eliminate the ephemeral pagination error, since direct editing cannot be performed
        if (
          this.option.ephemeral &&
          this.sendTo instanceof ChatInputCommandInteraction
        ) {
          if (!this._isFollowUp) {
            await this.sendTo.editReply(finalPage.newMessage).catch(() => {
              this.unableToUpdate();
            });
          }
        } else {
          await message.edit(finalPage.newMessage).catch(() => {
            this.unableToUpdate();
          });
        }
      }

      // Perform pagination timeout
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
