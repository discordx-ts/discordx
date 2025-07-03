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
  PaginationInteractions,
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
  //#region Properties & Constructor

  public maxLength: number;
  public currentPage: number;
  public options: PaginationOptions;
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
    this.maxLength = Array.isArray(pages) ? pages.length : pages.maxLength;
    this.currentPage = config?.initialPage ?? 0;

    this.options = {
      type:
        this.maxLength < 20 ? PaginationType.Button : PaginationType.SelectMenu,
      ...config,
    };

    // Add validation
    this.validateConfiguration();
  }

  //#endregion

  //#region Configuration & Validation

  /**
   * Validate configuration and throw descriptive errors
   */
  private validateConfiguration(): void {
    if (this.options.ephemeral && this.options.enableExit) {
      throw new Error("Ephemeral pagination does not support exit mode");
    }

    if (this.maxLength <= 0) {
      throw new Error("Pagination must have at least one page");
    }

    if (this.currentPage < 0 || this.currentPage >= this.maxLength) {
      throw new Error(
        `Initial page ${this.currentPage.toString()} is out of bounds. Must be between 0 and ${(this.maxLength - 1).toString()}`,
      );
    }

    // Validate button options if using button pagination
    if (this.options.type === PaginationType.Button) {
      this.validateButtonOptions();
    }
  }

  /**
   * Validate button configuration
   */
  private validateButtonOptions(): void {
    // Check for duplicate button IDs
    const ids = [
      this.getButtonId("start"),
      this.getButtonId("end"),
      this.getButtonId("next"),
      this.getButtonId("previous"),
      this.getButtonId("exit"),
    ];

    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length > 0) {
      throw new Error(`Duplicate button IDs found: ${duplicates.join(", ")}`);
    }
  }

  //#endregion

  //#region Utility & Helper Methods

  /**
   * Log debug messages with consistent formatting
   */
  private debug(message: string): void {
    if (this.options.debug) {
      console.log(`[Pagination] ${message}`);
    }
  }

  /**
   * Handle update errors gracefully
   */
  private unableToUpdate(error?: unknown): void {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    this.debug(`Unable to update pagination: ${errorMessage}`);
  }

  /**
   * Get button ID with fallback to default
   */
  private getButtonId(
    buttonType: "start" | "end" | "next" | "previous" | "exit",
  ): string {
    if (this.options.type !== PaginationType.Button) {
      return defaultIds.buttons[buttonType];
    }

    const buttonOptions = this.options;

    switch (buttonType) {
      case "start":
        return buttonOptions.start?.id ?? defaultIds.buttons.start;
      case "end":
        return buttonOptions.end?.id ?? defaultIds.buttons.end;
      case "next":
        return buttonOptions.next?.id ?? defaultIds.buttons.next;
      case "previous":
        return buttonOptions.previous?.id ?? defaultIds.buttons.previous;
      case "exit":
        return buttonOptions.exit?.id ?? defaultIds.buttons.exit;
      default:
        return defaultIds.buttons[buttonType];
    }
  }

  /**
   * Get menu ID with fallback to default
   */
  private getMenuId(): string {
    if (this.options.type !== PaginationType.SelectMenu) {
      return defaultIds.menu;
    }

    const selectOptions = this.options;
    return selectOptions.menuId ?? defaultIds.menu;
  }

  /**
   * Get time with fallback to default
   */
  private getTime(): number {
    return this.options.time ?? defaultTime;
  }

  //#endregion

  //#region Public API - Core Functionality

  /**
   * Get page
   */
  public getPage = async (page: number): Promise<IGeneratePage | null> => {
    if (page < 0 || page >= this.maxLength) {
      this.debug(
        `Page ${page.toString()} is out of bounds (0-${String(this.maxLength - 1)})`,
      );
      return null;
    }

    try {
      const embed = Array.isArray(this.pages)
        ? cloneDeep<PaginationItem | undefined>(this.pages[page])
        : await this.pages.resolver(page, this);

      if (!embed) {
        this.debug(`No content found for page ${page.toString()}`);
        return null;
      }

      return GeneratePage(embed, page, this.maxLength, this.options);
    } catch (error) {
      this.debug(`Error generating page ${page.toString()}: ${String(error)}`);
      return null;
    }
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
    if (this._isSent) {
      throw new Error(
        "Pagination has already been sent. Create a new instance to send again.",
      );
    }

    try {
      // Prepare and send initial message
      const pageData = await this.prepareInitialMessage();
      const message = await this.sendMessage(pageData);

      // Create and setup collector
      const collector = this.createCollector(message);

      this.collector = collector;
      this.message = message;
      this._isSent = true;

      this.debug(
        `Pagination sent successfully with ${this.maxLength.toString()} pages`,
      );

      return { collector, message };
    } catch (error) {
      this.debug(`Failed to send pagination: ${String(error)}`);
      throw new Error(
        `Failed to send pagination: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Stop the pagination collector
   */
  public stop(): void {
    if (this.collector && !this.collector.ended) {
      this.collector.stop();
      this.debug("Pagination stopped manually");
    }
  }

  //#endregion

  //#region Public API - Navigation

  /**
   * Navigate to a specific page
   */
  public navigateToPage(page: number): boolean {
    if (page < 0 || page >= this.maxLength) {
      this.debug(
        `Cannot navigate to page ${page.toString()}: out of bounds (0-${String(this.maxLength - 1)})`,
      );
      return false;
    }

    if (page === this.currentPage) {
      this.debug(`Already on page ${page.toString()}`);
      return false;
    }

    this.currentPage = page;
    this.debug(`Navigated to page ${page.toString()}`);
    return true;
  }

  /**
   * Navigate to next page
   */
  public navigateNext(): boolean {
    if (this.currentPage >= this.maxLength - 1) {
      this.debug("Cannot navigate next: already on last page");
      return false;
    }

    this.currentPage++;
    this.debug(`Navigated to next page: ${this.currentPage.toString()}`);
    return true;
  }

  /**
   * Navigate to previous page
   */
  public navigatePrevious(): boolean {
    if (this.currentPage <= 0) {
      this.debug("Cannot navigate previous: already on first page");
      return false;
    }

    this.currentPage--;
    this.debug(`Navigated to previous page: ${this.currentPage.toString()}`);
    return true;
  }

  //#endregion

  //#region Public API - State & Utilities

  /**
   * Check if pagination can navigate to next page
   */
  public canNavigateNext(): boolean {
    return this.currentPage < this.maxLength - 1;
  }

  /**
   * Check if pagination can navigate to previous page
   */
  public canNavigatePrevious(): boolean {
    return this.currentPage > 0;
  }

  /**
   * Get current page info
   */
  public getPageInfo(): {
    currentPage: number;
    totalPages: number;
    canNext: boolean;
    canPrevious: boolean;
    isFirst: boolean;
    isLast: boolean;
  } {
    return {
      currentPage: this.currentPage,
      totalPages: this.maxLength,
      canNext: this.canNavigateNext(),
      canPrevious: this.canNavigatePrevious(),
      isFirst: this.currentPage === 0,
      isLast: this.currentPage === this.maxLength - 1,
    };
  }

  /**
   * Navigate to first page
   */
  public navigateToStart(): boolean {
    if (this.currentPage === 0) {
      this.debug("Already on first page");
      return false;
    }

    this.currentPage = 0;
    this.debug("Navigated to start page");
    return true;
  }

  /**
   * Navigate to last page
   */
  public navigateToEnd(): boolean {
    const lastPage = this.maxLength - 1;
    if (this.currentPage === lastPage) {
      this.debug("Already on last page");
      return false;
    }

    this.currentPage = lastPage;
    this.debug("Navigated to end page");
    return true;
  }

  //#endregion

  //#region Private - Message Handling

  /**
   * Update the pagination message with current page
   */
  private async updatePaginationMessage(
    interaction: ButtonInteraction | StringSelectMenuInteraction,
  ): Promise<void> {
    try {
      await interaction.deferUpdate();

      // Get current page data
      const pageData = await this.getPage(this.currentPage);
      if (!pageData) {
        throw new Error("Pagination: out of bound page");
      }

      // Add pagination row to components
      const messageData = {
        ...pageData.newMessage,
        components: pageData.newMessage.components
          ? [...pageData.newMessage.components, pageData.paginationRow]
          : [pageData.paginationRow],
      };

      // Update the message
      await interaction.editReply(messageData);
    } catch (error) {
      this.unableToUpdate(error);
    }
  }

  /**
   * Prepare initial message with pagination components
   */
  private async prepareInitialMessage(): Promise<IGeneratePage> {
    const page = await this.getPage(this.currentPage);
    if (!page) {
      throw new Error("Pagination: out of bound page");
    }

    // Add pagination row to components
    const components = page.newMessage.components
      ? [...page.newMessage.components, page.paginationRow]
      : [page.paginationRow];

    return {
      ...page,
      newMessage: {
        ...page.newMessage,
        components,
      },
    };
  }

  /**
   * Send message via interaction (reply or followUp)
   */
  private async sendInteractionMessage(
    pageData: IGeneratePage,
  ): Promise<Message> {
    const interaction = this.sendTo as PaginationInteractions;

    // Check if this should be a follow-up
    if (interaction.deferred || interaction.replied) {
      this._isFollowUp = true;
    }

    const messageOptions = {
      ...pageData.newMessage,
      ephemeral: this.options.ephemeral,
    };

    if (this._isFollowUp) {
      const reply = await interaction.followUp({
        ...messageOptions,
        fetchReply: true,
      });
      return reply;
    } else {
      const response = await interaction.reply({
        ...messageOptions,
        withResponse: true,
      });

      const message = response.resource?.message;
      if (!message) {
        throw new Error(
          "Missing Intent: GUILD_MESSAGES\n" +
            "Without guild message intent, pagination does not work. " +
            "Consider adding GUILD_MESSAGES as an intent\n" +
            "Read more at https://discordx.js.org/docs/faq/Errors/Pagination#missing-intent-guild_messages",
        );
      }
      return message;
    }
  }

  /**
   * Send message based on sendTo type
   */
  private async sendMessage(pageData: IGeneratePage): Promise<Message> {
    if (this.sendTo instanceof Message) {
      return await this.sendTo.reply(pageData.newMessage);
    }

    if (
      this.sendTo instanceof CommandInteraction ||
      this.sendTo instanceof MessageComponentInteraction ||
      this.sendTo instanceof ContextMenuCommandInteraction
    ) {
      return await this.sendInteractionMessage(pageData);
    }

    if (this.sendTo.type === ChannelType.GuildStageVoice) {
      throw new Error("Pagination not supported with guild stage channel");
    }

    return await this.sendTo.send(pageData.newMessage);
  }

  //#endregion

  //#region Private - Collector Management

  /**
   * Create and configure the message component collector
   */
  private createCollector(
    message: Message,
  ): InteractionCollector<ButtonInteraction | StringSelectMenuInteraction> {
    const collector = message.createMessageComponentCollector({
      ...this.options,
      componentType:
        this.options.type === PaginationType.Button
          ? ComponentType.Button
          : ComponentType.StringSelect,
      time: this.getTime(),
    });

    this.setupCollectorEvents(collector);
    return collector;
  }

  /**
   * Setup collector event handlers
   */
  private setupCollectorEvents(
    collector: InteractionCollector<
      ButtonInteraction | StringSelectMenuInteraction
    >,
  ): void {
    const resetCollectorTimer = () => {
      collector.resetTimer({
        idle: this.options.idle,
        time: this.getTime(),
      });
    };

    collector.on("collect", (interaction) => {
      void this.handleCollectorInteraction(interaction, resetCollectorTimer);
    });

    collector.on("end", () => {
      void this.handleCollectorEnd();
    });
  }

  /**
   * Handle collector interaction (button or select menu)
   */
  private async handleCollectorInteraction(
    interaction: ButtonInteraction | StringSelectMenuInteraction,
    resetTimer: () => void,
  ): Promise<void> {
    try {
      if (
        interaction.isButton() &&
        this.options.type === PaginationType.Button
      ) {
        const shouldContinue = this.handleButtonInteraction(interaction);
        if (shouldContinue) {
          await this.updatePaginationMessage(interaction);
          resetTimer();
        } else {
          this.collector?.stop();
        }
      } else if (
        interaction.isStringSelectMenu() &&
        this.options.type === PaginationType.SelectMenu &&
        interaction.customId === this.getMenuId()
      ) {
        const shouldContinue = this.handleSelectMenuInteraction(interaction);
        if (shouldContinue) {
          await this.updatePaginationMessage(interaction);
          resetTimer();
        } else {
          this.collector?.stop();
        }
      }
    } catch (error) {
      this.debug(`Error handling collector interaction: ${String(error)}`);
    }
  }

  /**
   * Handle button interaction and return whether to continue
   */
  private handleButtonInteraction(interaction: ButtonInteraction): boolean {
    if (interaction.customId === this.getButtonId("exit")) {
      return false; // Stop collector
    } else if (interaction.customId === this.getButtonId("start")) {
      return this.navigateToStart();
    } else if (interaction.customId === this.getButtonId("end")) {
      return this.navigateToEnd();
    } else if (interaction.customId === this.getButtonId("next")) {
      return this.navigateNext();
    } else if (interaction.customId === this.getButtonId("previous")) {
      return this.navigatePrevious();
    }

    return false; // Unknown button, don't continue
  }

  /**
   * Handle select menu interaction and return whether to continue
   */
  private handleSelectMenuInteraction(
    interaction: StringSelectMenuInteraction,
  ): boolean {
    const selectedValue = Number(interaction.values[0] ?? 0);

    if (selectedValue === Number(SelectMenuPageId.Exit)) {
      return false; // Stop collector
    }

    if (selectedValue === Number(SelectMenuPageId.Start)) {
      return this.navigateToStart();
    } else if (selectedValue === Number(SelectMenuPageId.End)) {
      return this.navigateToEnd();
    } else {
      return this.navigateToPage(selectedValue);
    }
  }

  /**
   * Handle collector end event
   */
  private async handleCollectorEnd(): Promise<void> {
    if (!this.message) return;

    try {
      const finalPage = await this.getPage(this.currentPage);
      if (this.message.editable && finalPage) {
        // Reset page components
        finalPage.newMessage.components = [];

        // Handle ephemeral pagination
        if (
          this.options.ephemeral &&
          this.sendTo instanceof ChatInputCommandInteraction &&
          !this._isFollowUp
        ) {
          await this.sendTo.editReply(finalPage.newMessage);
        } else {
          await this.message.edit(finalPage.newMessage);
        }
      }

      // Call timeout callback if provided
      if (this.options.onTimeout) {
        this.options.onTimeout(this.currentPage, this.message);
      }
    } catch (error) {
      this.unableToUpdate(error);
    }
  }

  //#endregion
}
