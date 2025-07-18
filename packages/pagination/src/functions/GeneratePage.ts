/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { MessageActionRowComponentBuilder } from "discord.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} from "discord.js";

import type {
  ButtonOptions,
  IPaginate,
  PaginationItem,
  PaginationOptions,
} from "../types.js";
import { defaultIds, defaultPerPageItem, SelectMenuPageId } from "../types.js";
import { createPagination } from "./Paginate.js";

export class PaginationBuilder {
  private readonly item: PaginationItem;
  private readonly currentPage: number;
  private readonly perPage: number;
  private readonly skipAmount: number;
  private readonly maxPage: number;
  private readonly config?: PaginationOptions;

  constructor(
    item: PaginationItem,
    currentPage: number,
    maxPage: number,
    config?: PaginationOptions,
  ) {
    this.validateInputs(currentPage, maxPage);
    this.item = this.prepareMessage(item);
    this.currentPage = currentPage;
    this.maxPage = maxPage;
    this.config = config;
    this.perPage = config?.itemsPerPage ?? defaultPerPageItem;
    this.skipAmount = config?.buttons?.skipAmount ?? defaultPerPageItem;
  }

  private validateInputs(page: number, maxPage: number): void {
    if (page < 0 || page >= maxPage) {
      throw new Error(
        `Page ${page.toString()} is out of bounds (0-${String(maxPage - 1)})`,
      );
    }
    if (maxPage <= 0) {
      throw new Error("Maximum pages must be greater than 0");
    }
  }

  private prepareMessage(item: PaginationItem): PaginationItem {
    return {
      ...item,
      embeds: item.embeds ?? [],
      files: item.files ?? [],
      attachments: item.attachments ?? [],
    };
  }

  /**
   * Get the display text for a page
   */
  private getPageText(pageNumber: number): string {
    if (Array.isArray(this.config?.selectMenu?.pageText)) {
      return this.config.selectMenu.pageText[pageNumber] ?? "Page {page}";
    }

    return this.config?.selectMenu?.pageText ?? "Page {page}";
  }

  /**
   * Create page-specific options for select menu
   */
  private createPageOptions(paginator: IPaginate) {
    const options = paginator.pages.map((pageNumber) => {
      const pageText = this.getPageText(pageNumber);

      return {
        label: pageText.replace(
          "{page}",
          (pageNumber + 1).toString().padStart(2, "0"),
        ),
        value: pageNumber.toString(),
      };
    });

    if (paginator.currentPage !== 0) {
      options.unshift({
        label: this.config?.selectMenu?.labels?.start ?? "First page",
        value: SelectMenuPageId.Start.toString(),
      });
    }

    if (paginator.currentPage !== paginator.totalPages - 1) {
      options.push({
        label: this.config?.selectMenu?.labels?.end ?? "Last page",
        value: SelectMenuPageId.End.toString(),
      });
    }

    return options;
  }

  private calculateButtonStates(): Record<string, boolean> {
    return {
      canGoPrevious: this.currentPage > 0,
      canSkipBackward: this.currentPage > 0,
      canSkipForward: this.currentPage < this.maxPage - 1,
      canGoNext: this.currentPage < this.maxPage - 1,
    };
  }

  private createNavigationButtons(): ButtonBuilder[] {
    const states = this.calculateButtonStates();
    const buttonConfigs = [
      {
        key: "previous",
        defaults: {
          emoji: "◀️",
          id: defaultIds.buttons.previous,
          label: "Previous",
          style: ButtonStyle.Secondary,
        },
        disabled: !states.canGoPrevious,
      },
      {
        key: "backward",
        defaults: {
          emoji: "⏪",
          id: defaultIds.buttons.backward,
          label: `-${this.skipAmount.toString()}`,
          style: ButtonStyle.Primary,
        },
        disabled: !states.canSkipBackward,
      },
      {
        key: "forward",
        defaults: {
          emoji: "⏩",
          id: defaultIds.buttons.forward,
          label: `+${this.skipAmount.toString()}`,
          style: ButtonStyle.Primary,
        },
        disabled: !states.canSkipForward,
      },
      {
        key: "next",
        defaults: {
          emoji: "▶️",
          id: defaultIds.buttons.next,
          label: "Next",
          style: ButtonStyle.Secondary,
        },
        disabled: !states.canGoNext,
      },
    ] as const;

    const buttons = buttonConfigs.map((config) => this.createButton(config));

    if (this.config?.enableExit) {
      buttons.push(
        this.createButton({
          key: "exit",
          defaults: {
            emoji: "⚔️",
            id: defaultIds.buttons.exit,
            label: "Stop",
            style: ButtonStyle.Danger,
          },
          disabled: false,
        }),
      );
    }

    return buttons;
  }

  private createButton(config: {
    key: keyof typeof defaultIds.buttons;
    defaults: Required<ButtonOptions>;
    disabled: boolean;
  }): ButtonBuilder {
    const userConfig = this.config?.buttons?.[config.key];

    const button = new ButtonBuilder()
      .setCustomId(userConfig?.id ?? config.defaults.id)
      .setLabel(userConfig?.label ?? config.defaults.label)
      .setStyle(userConfig?.style ?? config.defaults.style)
      .setDisabled(config.disabled);

    const emoji = userConfig?.emoji ?? config.defaults.emoji;
    if (emoji) {
      button.setEmoji(emoji);
    }

    return button;
  }

  /**
   * Create navigation button row
   */
  private createNavigationButtonRow(): ActionRowBuilder<MessageActionRowComponentBuilder> {
    const buttons = this.createNavigationButtons();
    return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      buttons,
    );
  }

  generate() {
    const paginator = createPagination({
      currentPage: this.currentPage,
      totalItems: this.maxPage,
      pageSize: 1,
      maxPages: this.perPage,
    });

    // Calculate the range for the placeholder
    const defaultFormat = "Currently viewing #{start} - #{end} of #{total}";
    const format =
      this.config?.selectMenu?.rangePlaceholderFormat ?? defaultFormat;

    const rangePlaceholder = format
      .replace("{start}", (paginator.startPage + 1).toString())
      .replace("{end}", (paginator.endPage + 1).toString())
      .replace("{total}", paginator.totalItems.toString());

    // Create select menu row
    const options = this.createPageOptions(paginator);
    const menu = new StringSelectMenuBuilder()
      .setCustomId(this.config?.selectMenu?.menuId ?? defaultIds.menu)
      .setPlaceholder(rangePlaceholder)
      .setOptions(options);

    const menuRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
        menu,
      ]);

    // Create navigation buttons row
    const buttonRow = this.createNavigationButtonRow();

    return { newMessage: this.item, components: [menuRow, buttonRow] };
  }
}
