/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
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
  IGeneratePage,
  PaginationItem,
  PaginationOptions,
} from "../types.js";
import { defaultIds, PaginationType, SelectMenuPageId } from "../types.js";
import { Paginate } from "./Paginate.js";

export function GeneratePage(
  item: PaginationItem,
  page: number,
  maxPage: number,
  config: PaginationOptions,
): IGeneratePage {
  const beginning = page === 0;
  const end = page === maxPage - 1;

  const newMessage: PaginationItem = item;

  function isStartEndAllowed(): boolean {
    if (config.showStartEnd === undefined) {
      return true;
    }

    if (typeof config.showStartEnd === "number") {
      return maxPage >= config.showStartEnd;
    }

    return config.showStartEnd;
  }

  /**
   * Pagination type button
   */

  if (config.type === PaginationType.Button) {
    const startBtn = new ButtonBuilder()
      .setCustomId(config.start?.id ?? defaultIds.buttons.start)
      .setLabel(config.start?.label ?? "Start")
      .setStyle(config.start?.style ?? ButtonStyle.Primary)
      .setDisabled(beginning);

    const endBtn = new ButtonBuilder()
      .setCustomId(config.end?.id ?? defaultIds.buttons.end)
      .setLabel(config.end?.label ?? "End")
      .setStyle(config.end?.style ?? ButtonStyle.Primary)
      .setDisabled(end);

    const nextBtn = new ButtonBuilder()
      .setCustomId(config.next?.id ?? defaultIds.buttons.next)
      .setLabel(config.next?.label ?? "Next")
      .setStyle(config.next?.style ?? ButtonStyle.Primary)
      .setDisabled(end);

    const prevBtn = new ButtonBuilder()
      .setCustomId(config.previous?.id ?? defaultIds.buttons.previous)
      .setLabel(config.previous?.label ?? "Previous")
      .setStyle(config.previous?.style ?? ButtonStyle.Primary)
      .setDisabled(beginning);

    const exitBtn = new ButtonBuilder()
      .setCustomId(config.exit?.id ?? defaultIds.buttons.exit)
      .setLabel(config.exit?.label ?? "Exit")
      .setStyle(config.exit?.style ?? ButtonStyle.Danger);

    // set emoji
    if (config.start?.emoji) {
      startBtn.setEmoji(config.start.emoji);
    }

    if (config.end?.emoji) {
      endBtn.setEmoji(config.end.emoji);
    }

    if (config.next?.emoji) {
      nextBtn.setEmoji(config.next.emoji);
    }

    if (config.previous?.emoji) {
      prevBtn.setEmoji(config.previous.emoji);
    }

    if (config.exit?.emoji) {
      exitBtn.setEmoji(config.exit.emoji);
    }

    const buttons: ButtonBuilder[] = [prevBtn, nextBtn];

    if (isStartEndAllowed()) {
      buttons.unshift(startBtn);
      buttons.push(endBtn);
    }

    if (config.enableExit) {
      buttons.push(exitBtn);
    }

    const row =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        buttons,
      );

    // reset message payload additional parameters
    if (!newMessage.embeds) {
      newMessage.embeds = [];
    }

    if (!newMessage.files) {
      newMessage.files = [];
    }

    if (!newMessage.attachments) {
      newMessage.attachments = [];
    }

    return { newMessage, paginationRow: row };
  }

  /**
   * Pagination type select menu
   */

  const paginator = Paginate(maxPage, page, 1, 21).pages.map((i) => {
    // get custom page title
    const text =
      config.pageText instanceof Array
        ? config.pageText[i - 1]
        : config.pageText;

    return {
      label: (text ?? "Page {page}").replaceAll("{page}", i.toString()),
      value: (i - 1).toString(),
    };
  });

  if (isStartEndAllowed()) {
    // add start option
    paginator.unshift({
      label: config.labels?.start ?? "Start",
      value: SelectMenuPageId.Start.toString(),
    });

    // add end option
    paginator.push({
      label: config.labels?.end ?? "End",
      value: SelectMenuPageId.End.toString(),
    });
  }

  // add exit option
  if (config.enableExit) {
    paginator.push({
      label: config.labels?.exit ?? "Exit Pagination",
      value: SelectMenuPageId.Exit.toString(),
    });
  }

  const menu = new StringSelectMenuBuilder()
    .setCustomId(config.menuId ?? defaultIds.menu)
    .setPlaceholder(config.placeholder ?? "Select page")
    .setOptions(paginator);

  const row =
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
      menu,
    ]);

  // reset message payload additional parameters
  if (!newMessage.embeds) {
    newMessage.embeds = [];
  }

  if (!newMessage.files) {
    newMessage.files = [];
  }

  if (!newMessage.attachments) {
    newMessage.attachments = [];
  }

  return { newMessage, paginationRow: row };
}
