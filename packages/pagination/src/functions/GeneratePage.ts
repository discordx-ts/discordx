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
  ButtonPaginationOptions,
  IGeneratePage,
  PaginationItem,
  PaginationOptions,
  SelectMenuPaginationOptions,
} from "../types.js";
import { defaultIds, PaginationType, SelectMenuPageId } from "../types.js";
import { createPagination } from "./Paginate.js";

//#region Main Function

export function GeneratePage(
  item: PaginationItem,
  page: number,
  maxPage: number,
  config: PaginationOptions,
): IGeneratePage {
  // Validate inputs
  validateInputs(page, maxPage);

  const newMessage = prepareMessage(item);

  if (config.type === PaginationType.Button) {
    return generateButtonPagination(newMessage, page, maxPage, config);
  } else {
    return generateSelectMenuPagination(newMessage, page, maxPage, config);
  }
}

//#endregion

//#region Validation & Utilities

/**
 * Validate input parameters
 */
function validateInputs(page: number, maxPage: number): void {
  if (page < 0 || page >= maxPage) {
    throw new Error(
      `Page ${page.toString()} is out of bounds (0-${String(maxPage - 1)})`,
    );
  }

  if (maxPage <= 0) {
    throw new Error("Maximum pages must be greater than 0");
  }
}

/**
 * Prepare the base message with default properties
 */
function prepareMessage(item: PaginationItem): PaginationItem {
  const newMessage = { ...item };

  // Ensure required properties exist
  newMessage.embeds ??= [];
  newMessage.files ??= [];
  newMessage.attachments ??= [];

  return newMessage;
}

/**
 * Check if start/end buttons/options should be shown
 */
function isStartEndAllowed(
  config: PaginationOptions,
  maxPage: number,
): boolean {
  if (config.showStartEnd === undefined) {
    return true;
  }

  if (typeof config.showStartEnd === "number") {
    return maxPage >= config.showStartEnd;
  }

  return config.showStartEnd;
}

//#endregion

//#region Button Pagination

/**
 * Generate button-based pagination
 */
function generateButtonPagination(
  newMessage: PaginationItem,
  currentPage: number,
  maxPage: number,
  config: PaginationOptions,
): IGeneratePage {
  const buttonConfig = config as ButtonPaginationOptions;
  const isFirst = currentPage === 0;
  const isLast = currentPage === maxPage - 1;

  const buttons: ButtonBuilder[] = [];

  // Add start button if allowed
  if (isStartEndAllowed(config, maxPage)) {
    buttons.push(createStartButton(buttonConfig, isFirst));
  }

  // Add navigation buttons
  buttons.push(
    createPreviousButton(buttonConfig, isFirst),
    createNextButton(buttonConfig, isLast),
  );

  // Add end button if allowed
  if (isStartEndAllowed(config, maxPage)) {
    buttons.push(createEndButton(buttonConfig, isLast));
  }

  // Add exit button if enabled
  if (config.enableExit) {
    buttons.push(createExitButton(buttonConfig));
  }

  const row =
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      buttons,
    );

  return { newMessage, paginationRow: row };
}

/**
 * Create start button
 */
function createStartButton(
  config: ButtonPaginationOptions,
  disabled: boolean,
): ButtonBuilder {
  const button = new ButtonBuilder()
    .setCustomId(config.start?.id ?? defaultIds.buttons.start)
    .setLabel(config.start?.label ?? "Start")
    .setStyle(config.start?.style ?? ButtonStyle.Primary)
    .setDisabled(disabled);

  if (config.start?.emoji) {
    button.setEmoji(config.start.emoji);
  }

  return button;
}

/**
 * Create previous button
 */
function createPreviousButton(
  config: ButtonPaginationOptions,
  disabled: boolean,
): ButtonBuilder {
  const button = new ButtonBuilder()
    .setCustomId(config.previous?.id ?? defaultIds.buttons.previous)
    .setLabel(config.previous?.label ?? "Previous")
    .setStyle(config.previous?.style ?? ButtonStyle.Primary)
    .setDisabled(disabled);

  if (config.previous?.emoji) {
    button.setEmoji(config.previous.emoji);
  }

  return button;
}

/**
 * Create next button
 */
function createNextButton(
  config: ButtonPaginationOptions,
  disabled: boolean,
): ButtonBuilder {
  const button = new ButtonBuilder()
    .setCustomId(config.next?.id ?? defaultIds.buttons.next)
    .setLabel(config.next?.label ?? "Next")
    .setStyle(config.next?.style ?? ButtonStyle.Primary)
    .setDisabled(disabled);

  if (config.next?.emoji) {
    button.setEmoji(config.next.emoji);
  }

  return button;
}

/**
 * Create end button
 */
function createEndButton(
  config: ButtonPaginationOptions,
  disabled: boolean,
): ButtonBuilder {
  const button = new ButtonBuilder()
    .setCustomId(config.end?.id ?? defaultIds.buttons.end)
    .setLabel(config.end?.label ?? "End")
    .setStyle(config.end?.style ?? ButtonStyle.Primary)
    .setDisabled(disabled);

  if (config.end?.emoji) {
    button.setEmoji(config.end.emoji);
  }

  return button;
}

/**
 * Create exit button
 */
function createExitButton(config: ButtonPaginationOptions): ButtonBuilder {
  const button = new ButtonBuilder()
    .setCustomId(config.exit?.id ?? defaultIds.buttons.exit)
    .setLabel(config.exit?.label ?? "Exit")
    .setStyle(config.exit?.style ?? ButtonStyle.Danger);

  if (config.exit?.emoji) {
    button.setEmoji(config.exit.emoji);
  }

  return button;
}

//#endregion

//#region Select Menu Pagination

/**
 * Generate select menu-based pagination
 */
function generateSelectMenuPagination(
  newMessage: PaginationItem,
  currentPage: number,
  maxPage: number,
  config: PaginationOptions,
): IGeneratePage {
  const selectConfig = config as SelectMenuPaginationOptions;

  const options = createSelectMenuOptions(selectConfig, currentPage, maxPage);

  const menu = new StringSelectMenuBuilder()
    .setCustomId(selectConfig.menuId ?? defaultIds.menu)
    .setPlaceholder(selectConfig.placeholder ?? "Select page")
    .setOptions(options);

  const row =
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
      menu,
    ]);

  return { newMessage, paginationRow: row };
}

/**
 * Create select menu options
 */
function createSelectMenuOptions(
  config: SelectMenuPaginationOptions,
  currentPage: number,
  maxPage: number,
) {
  const options = [];

  // Add start option if allowed
  if (isStartEndAllowed(config, maxPage)) {
    options.push({
      label: config.labels?.start ?? "Start",
      value: SelectMenuPageId.Start.toString(),
    });
  }

  // Add page options
  const pageOptions = createPageOptions(config, currentPage, maxPage);
  options.push(...pageOptions);

  // Add end option if allowed
  if (isStartEndAllowed(config, maxPage)) {
    options.push({
      label: config.labels?.end ?? "End",
      value: SelectMenuPageId.End.toString(),
    });
  }

  // Add exit option if enabled
  if (config.enableExit) {
    options.push({
      label: config.labels?.exit ?? "Exit Pagination",
      value: SelectMenuPageId.Exit.toString(),
    });
  }

  return options;
}

/**
 * Create page-specific options for select menu
 */
function createPageOptions(
  config: SelectMenuPaginationOptions,
  currentPage: number,
  totalItems: number,
) {
  const paginator = createPagination({
    totalItems,
    currentPage: currentPage,
    pageSize: 1,
    maxPages: 21,
  });

  return paginator.pages.map((pageNumber) => {
    const pageText = getPageText(config, pageNumber);

    return {
      label: pageText.replace("{page}", (pageNumber + 1).toString()),
      value: pageNumber.toString(),
    };
  });
}

/**
 * Get the display text for a page
 */
function getPageText(
  config: SelectMenuPaginationOptions,
  pageNumber: number,
): string {
  if (Array.isArray(config.pageText)) {
    return config.pageText[pageNumber] ?? "Page {page}";
  }

  return config.pageText ?? "Page {page}";
}

//#endregion
