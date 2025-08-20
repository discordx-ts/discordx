/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import {
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  StringSelectMenuBuilder,
} from "discord.js";

import { createPagination } from "../utils/index.js";
import type {
  ButtonOptions,
  IPaginate,
  PaginationItem,
  PaginationOptions,
} from "./index.js";
import { defaultIds, defaultPerPageItem, SelectMenuPageId } from "./index.js";

export class PaginationBuilder {
  private readonly item: PaginationItem;
  private readonly currentPage: number;
  private readonly perPage: number;
  private readonly skipAmount: number;
  private readonly maxPage: number;
  private readonly config?: PaginationOptions;

  constructor(
    _item: PaginationItem,
    _currentPage: number,
    _maxPage: number,
    _config?: PaginationOptions,
  ) {
    this.item = this.prepareMessage(_item);
    this.currentPage = _currentPage;
    this.maxPage = _maxPage;
    this.config = _config;
    this.perPage = _config?.itemsPerPage ?? defaultPerPageItem;
    this.skipAmount = _config?.buttons?.skipAmount ?? defaultPerPageItem;
    this.validateInputs();
  }

  private validateInputs(): void {
    if (this.currentPage < 0 || this.currentPage >= this.maxPage) {
      throw new Error(
        `Page ${this.currentPage.toString()} is out of bounds (0-${String(this.maxPage - 1)})`,
      );
    }

    if (this.maxPage <= 0) {
      throw new Error("Maximum pages must be greater than 0");
    }

    if (this.config?.buttons?.disabled && this.config.selectMenu?.disabled) {
      throw new Error(
        "Both navigation buttons and the select menu cannot be disabled at the same time",
      );
    }
  }

  private prepareMessage(item: PaginationItem): PaginationItem {
    return {
      ...item,
      attachments: item.attachments ?? [],
      components: item.components ?? [],
      embeds: item.embeds ?? [],
      files: item.files ?? [],
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
        enabled: true,
      },
      {
        key: "backward",
        defaults: {
          emoji: "⏪",
          id: defaultIds.buttons.backward,
          label: `-${String(Math.min(this.currentPage, this.skipAmount))}`,
          style: ButtonStyle.Primary,
        },
        disabled: !states.canSkipBackward,
        enabled: true,
      },
      {
        key: "forward",
        defaults: {
          emoji: "⏩",
          id: defaultIds.buttons.forward,
          label: `+${String(Math.min(this.maxPage - (this.currentPage + 1), this.skipAmount))}`,
          style: ButtonStyle.Primary,
        },
        disabled: !states.canSkipForward,
        enabled: true,
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
        enabled: true,
      },
      {
        key: "exit",
        defaults: {
          emoji: "⚔️",
          id: defaultIds.buttons.exit,
          label: "Stop",
          style: ButtonStyle.Danger,
        },
        disabled: false,
        enabled: false,
      },
    ] as const;

    const buttons: ButtonBuilder[] = [];

    for (const config of buttonConfigs) {
      const userConfig = this.config?.buttons?.[config.key];
      const isEnabled = userConfig?.enabled ?? config.enabled;

      if (isEnabled) {
        buttons.push(this.createButton(config));
      }
    }

    return buttons;
  }

  private createButton(config: {
    key: keyof typeof defaultIds.buttons;
    defaults: Required<Omit<ButtonOptions, "enabled">>;
    disabled: boolean;
  }): ButtonBuilder {
    const userConfig = this.config?.buttons?.[config.key];

    const button = new ButtonBuilder()
      .setCustomId(userConfig?.id ?? config.defaults.id)
      .setStyle(userConfig?.style ?? config.defaults.style)
      .setDisabled(config.disabled);

    const label = userConfig?.label ?? config.defaults.label;
    if (label) {
      button.setLabel(label);
    }

    const emoji = userConfig?.emoji ?? config.defaults.emoji;
    if (emoji) {
      button.setEmoji(emoji);
    }

    if (!label || !emoji) {
      throw Error("Pagination buttons must include either an emoji or a label");
    }

    return button;
  }

  public getBaseItem(): PaginationItem {
    return this.item;
  }

  public getPaginatedItem(): PaginationItem {
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

    // Prepare menu selection
    const options = this.createPageOptions(paginator);
    const menu = new StringSelectMenuBuilder()
      .setCustomId(this.config?.selectMenu?.menuId ?? defaultIds.menu)
      .setPlaceholder(rangePlaceholder)
      .setOptions(options);

    // Prepare buttons
    const buttons = this.createNavigationButtons();

    // Add pagination row to components
    const messageComponents = this.item.components ?? [];
    const components = [...messageComponents];

    // Add menu row
    if (!this.config?.selectMenu?.disabled) {
      components.push({
        components: [menu],
        type: ComponentType.ActionRow,
      });
    }

    // Add button row
    if (!this.config?.buttons?.disabled) {
      components.push({
        components: buttons,
        type: ComponentType.ActionRow,
      });
    }

    return { ...this.item, components };
  }
}
