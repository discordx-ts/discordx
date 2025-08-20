/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type {
  ButtonInteraction,
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

import type {
  PaginationCollectors,
  PaginationInteractions,
  PaginationItem,
  PaginationOptions,
  PaginationResolver,
  PaginationSendTo,
} from "./index.js";
import {
  defaultIds,
  defaultPerPageItem,
  defaultTime,
  PaginationBuilder,
  SelectMenuPageId,
} from "./index.js";

export class Pagination<T extends PaginationResolver = PaginationResolver> {
  //#region Properties & Constructor

  public maxLength: number;
  public currentPage: number;
  public collectors?: PaginationCollectors;

  public message?: Message;
  private _isSent = false;
  private _isFollowUp = false;

  get isSent(): boolean {
    return this._isSent;
  }

  constructor(
    public sendTo: PaginationSendTo,
    public pages: PaginationItem[] | T,
    public config?: PaginationOptions,
  ) {
    this.maxLength = Array.isArray(pages) ? pages.length : pages.maxLength;
    this.currentPage = config?.initialPage ?? 0;

    // Add validation
    this.validateConfiguration();
  }

  //#endregion

  //#region Configuration & Validation

  /**
   * Validate configuration and throw descriptive errors
   */
  private validateConfiguration(): void {
    if (this.config?.ephemeral && this.config.buttons?.exit?.enabled) {
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

    // Validate button options
    this.validateButtonOptions();
  }

  /**
   * Validate button configuration
   */
  private validateButtonOptions(): void {
    // Check for duplicate button IDs
    const ids = [
      this.getButtonId("previous"),
      this.getButtonId("backward"),
      this.getButtonId("forward"),
      this.getButtonId("next"),
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
    if (this.config?.debug) {
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
   * Get skip amount
   */
  private getSkipAmount() {
    return this.config?.buttons?.skipAmount ?? defaultPerPageItem;
  }

  /**
   * Get button ID with fallback to default
   */
  private getButtonId(
    buttonType: "previous" | "backward" | "forward" | "next" | "exit",
  ): string {
    return (
      this.config?.buttons?.[buttonType]?.id ?? defaultIds.buttons[buttonType]
    );
  }

  /**
   * Get menu ID with fallback to default
   */
  private getMenuId(): string {
    return this.config?.selectMenu?.menuId ?? defaultIds.menu;
  }

  /**
   * Get time with fallback to default
   */
  private getTime(): number {
    return this.config?.time ?? defaultTime;
  }

  //#endregion

  //#region Public API - Core Functionality

  /**
   * Get page
   */
  public getPage = async (page: number): Promise<PaginationBuilder> => {
    if (page < 0 || page >= this.maxLength) {
      throw new Error(
        `Page ${String(page)} is out of bounds (0-${String(this.maxLength - 1)})`,
      );
    }

    const item = Array.isArray(this.pages)
      ? cloneDeep<PaginationItem | undefined>(this.pages[page])
      : await this.pages.resolver(page, this);

    if (!item) {
      throw new Error(`No content found for page ${page.toString()}`);
    }

    const pagination = new PaginationBuilder(
      item,
      page,
      this.maxLength,
      this.config,
    );

    return pagination;
  };

  /**
   * Send pagination
   * @returns
   */
  public async send(): Promise<{
    collectors: PaginationCollectors;
    message: Message;
  }> {
    if (this._isSent) {
      throw new Error(
        "Pagination has already been sent. Create a new instance to send again.",
      );
    }

    try {
      // Prepare and send initial message
      const page = await this.getPage(this.currentPage);
      const message = await this.sendMessage(page.getPaginatedItem());

      // Create and setup collector
      const collectors = this.createCollector(message);

      this.collectors = collectors;
      this.message = message;
      this._isSent = true;

      this.debug(
        `Pagination sent successfully with ${this.maxLength.toString()} pages`,
      );

      return { collectors, message };
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
    if (this.collectors) {
      if (!this.collectors.buttonCollector.ended) {
        this.collectors.buttonCollector.stop();
      }
      if (!this.collectors.menuCollector.ended) {
        this.collectors.menuCollector.stop();
      }
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
   * Handle exit
   */
  private async handleExit(interaction: ButtonInteraction): Promise<void> {
    try {
      await interaction.deferUpdate();

      const page = await this.getPage(this.currentPage);

      await interaction.editReply(page.getBaseItem());
      this.stop();
    } catch (error) {
      this.unableToUpdate(error);
    }
  }

  /**
   * Update the pagination message with current page
   */
  private async updatePaginationMessage(
    interaction: ButtonInteraction | StringSelectMenuInteraction,
  ): Promise<void> {
    try {
      await interaction.deferUpdate();

      // Get current page data
      const page = await this.getPage(this.currentPage);

      // Update the message
      await interaction.editReply(page.getPaginatedItem());
    } catch (error) {
      this.unableToUpdate(error);
    }
  }

  /**
   * Send message via interaction (reply or followUp)
   */
  private async sendInteractionMessage(
    message: PaginationItem,
  ): Promise<Message> {
    const interaction = this.sendTo as PaginationInteractions;

    // Check if this should be a follow-up
    if (interaction.deferred || interaction.replied) {
      this._isFollowUp = true;
    }

    const messageOptions = {
      ...message,
      ephemeral: this.config?.ephemeral,
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
  private async sendMessage(message: PaginationItem): Promise<Message> {
    if (this.sendTo instanceof Message) {
      return await this.sendTo.reply(message);
    }

    if (
      this.sendTo instanceof CommandInteraction ||
      this.sendTo instanceof MessageComponentInteraction ||
      this.sendTo instanceof ContextMenuCommandInteraction
    ) {
      return await this.sendInteractionMessage(message);
    }

    if (this.sendTo.type === ChannelType.GuildStageVoice) {
      throw new Error("Pagination not supported with guild stage channel");
    }

    return await this.sendTo.send(message);
  }

  //#endregion

  //#region Private - Collector Management

  /**
   * Create and configure the collectors
   */
  private createCollector(message: Message): PaginationCollectors {
    // Create button collector
    const buttonCollector = message.createMessageComponentCollector({
      ...this.config,
      componentType: ComponentType.Button,
      time: this.getTime(),
    });

    // Create select menu collector
    const menuCollector = message.createMessageComponentCollector({
      ...this.config,
      componentType: ComponentType.StringSelect,
      time: this.getTime(),
    });

    // Setup collectors
    this.setupCollectorEvents({ buttonCollector, menuCollector });

    // Return the primary collector for compatibility
    return { buttonCollector, menuCollector };
  }

  /**
   * Setup collector event handlers
   */
  private setupCollectorEvents({
    buttonCollector,
    menuCollector,
  }: PaginationCollectors): void {
    const resetCollectorTimers = () => {
      const timerOptions = {
        idle: this.config?.idle,
        time: this.getTime(),
      };
      buttonCollector.resetTimer(timerOptions);
      menuCollector.resetTimer(timerOptions);
    };

    // Handle button interactions
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    buttonCollector.on("collect", async (interaction) => {
      const shouldContinue = this.handleButtonInteraction(interaction);
      if (shouldContinue) {
        await this.updatePaginationMessage(interaction);
        resetCollectorTimers();
      }
    });

    // Handle select menu interactions
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    menuCollector.on("collect", async (interaction) => {
      const shouldContinue = this.handleSelectMenuInteraction(interaction);
      if (shouldContinue) {
        await this.updatePaginationMessage(interaction);
        resetCollectorTimers();
      }
    });

    // Handle collector end
    buttonCollector.on("end", () => {
      menuCollector.stop();
      void this.handleCollectorEnd();
    });

    menuCollector.on("end", () => {
      buttonCollector.stop();
      void this.handleCollectorEnd();
    });
  }

  /**
   * Handle button interaction
   */
  private handleButtonInteraction(interaction: ButtonInteraction): boolean {
    const customId = interaction.customId;

    if (customId === defaultIds.buttons.exit) {
      void this.handleExit(interaction);
      return false;
    } else if (customId === defaultIds.buttons.previous) {
      return this.navigatePrevious();
    } else if (customId === defaultIds.buttons.next) {
      return this.navigateNext();
    } else if (customId === defaultIds.buttons.backward) {
      return this.navigateToPage(
        Math.max(0, this.currentPage - this.getSkipAmount()),
      );
    } else if (customId === defaultIds.buttons.forward) {
      return this.navigateToPage(
        Math.min(this.maxLength - 1, this.currentPage + this.getSkipAmount()),
      );
    }

    return false;
  }

  /**
   * Handle select menu interaction
   */
  private handleSelectMenuInteraction(
    interaction: StringSelectMenuInteraction,
  ): boolean {
    if (interaction.customId !== this.getMenuId()) {
      return false;
    }

    const selectedValue = Number(interaction.values[0] ?? 0);

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
      const page = await this.getPage(this.currentPage);
      if (this.message.editable) {
        // Handle ephemeral pagination
        if (
          this.config?.ephemeral &&
          this.sendTo instanceof ChatInputCommandInteraction &&
          !this._isFollowUp
        ) {
          await this.sendTo.editReply(page.getBaseItem());
        } else {
          await this.message.edit(page.getBaseItem());
        }
      }

      // Call timeout callback if provided
      if (this.config?.onTimeout) {
        this.config.onTimeout(this.currentPage, this.message);
      }
    } catch (error) {
      this.unableToUpdate(error);
    }
  }

  //#endregion
}
