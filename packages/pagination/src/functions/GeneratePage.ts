import type { MessageOptions } from "discord.js";
import { SelectMenuComponent, SelectMenuOption } from "discord.js";
import { ButtonStyle } from "discord.js";
import { ActionRow, ButtonComponent } from "discord.js";
import { Embed } from "discord.js";

import type { IGeneratePage, PaginationOptions } from "../types.js";
import { defaultIds } from "../types.js";
import { paginate } from "./paginate.js";

export const GeneratePage = (
  embed: string | Embed | MessageOptions,
  page: number,
  totalPages: number,
  option: PaginationOptions
): IGeneratePage => {
  const beginning = page === 0;
  const end = page === totalPages - 1;

  const cpage: MessageOptions =
    typeof embed === "string"
      ? { content: embed }
      : embed instanceof Embed
      ? { embeds: [embed] }
      : embed;

  if (option.type === "BUTTON") {
    const startBtn = new ButtonComponent()
      .setCustomId(option.start?.id ?? defaultIds.buttons.start)
      .setLabel(option.start?.label ?? "Start")
      .setStyle(option.start?.style ?? ButtonStyle.Primary)
      .setDisabled(beginning);

    const endBtn = new ButtonComponent()
      .setCustomId(option.end?.id ?? defaultIds.buttons.end)
      .setLabel(option.end?.label ?? "End")
      .setStyle(option.end?.style ?? ButtonStyle.Primary)
      .setDisabled(end);

    const nextBtn = new ButtonComponent()
      .setCustomId(option.next?.id ?? defaultIds.buttons.next)
      .setLabel(option.next?.label ?? "Next")
      .setStyle(option.next?.style ?? ButtonStyle.Primary)
      .setDisabled(end);

    const prevBtn = new ButtonComponent()
      .setCustomId(option.previous?.id ?? defaultIds.buttons.previous)
      .setLabel(option.previous?.label ?? "Previous")
      .setStyle(option.previous?.style ?? ButtonStyle.Primary)
      .setDisabled(beginning);

    const exitBtn = new ButtonComponent()
      .setCustomId(option.exit?.id ?? defaultIds.buttons.exit)
      .setLabel(option.exit?.label ?? "Exit")
      .setStyle(option.exit?.style ?? ButtonStyle.Danger);

    // set emoji
    if (option.start?.emoji) {
      startBtn.setEmoji(option.start.emoji);
    }

    if (option.end?.emoji) {
      endBtn.setEmoji(option.end.emoji);
    }

    if (option.next?.emoji) {
      nextBtn.setEmoji(option.next.emoji);
    }

    if (option.previous?.emoji) {
      prevBtn.setEmoji(option.previous.emoji);
    }

    if (option.exit?.emoji) {
      exitBtn.setEmoji(option.exit.emoji);
    }

    const buttons: ButtonComponent[] = [prevBtn, nextBtn];

    if (totalPages > 10 && (option.showStartEnd ?? true)) {
      buttons.unshift(startBtn);
      buttons.push(endBtn);
    }

    if (option.enableExit) {
      buttons.push(exitBtn);
    }

    const row = new ActionRow().addComponents(...buttons);

    // reset message payload additional parameters
    if (!cpage.embeds) {
      cpage.embeds = [];
    }

    if (!cpage.files) {
      cpage.files = [];
    }

    if (!cpage.files) {
      cpage.files = [];
    }

    if (!cpage.attachments) {
      cpage.attachments = [];
    }

    return { paginationRow: row, replyOptions: cpage };
  } else {
    const paginator = paginate(totalPages, page, 1, 21).pages.map((i) => {
      // const selectMenuOption: MessageSelectOptionData = {
      const selectMenuOption = new SelectMenuOption({
        label: (
          (option.pageText instanceof Array
            ? option.pageText[i - 1]
            : option.pageText) ?? "Page {page}"
        ).replaceAll("{page}", `${i}`),
        value: (i - 1).toString(),
      });
      return selectMenuOption;
    });

    if (totalPages > 21 && (option.showStartEnd ?? true)) {
      if (page > 10) {
        paginator.unshift(
          new SelectMenuOption({
            label: option.labels?.start ?? "Start",
            value: "-1",
          })
        );
      }
      if (page < totalPages - 10) {
        paginator.push(
          new SelectMenuOption({
            label: option.labels?.end ?? "End",
            value: "-2",
          })
        );
      }
    }

    if (option.enableExit) {
      paginator.push(
        new SelectMenuOption({
          label: option.labels?.exit ?? "Exit Pagination",
          value: "-3",
        })
      );
    }

    const menu = new SelectMenuComponent()
      .setCustomId(option.menuId ?? defaultIds.menu)
      .setPlaceholder(option.placeholder ?? "Select page")
      .setOptions(paginator);

    const row = new ActionRow().addComponents(menu);

    // reset message payload additional parameters
    if (!cpage.embeds) {
      cpage.embeds = [];
    }

    if (!cpage.files) {
      cpage.files = [];
    }

    if (!cpage.files) {
      cpage.files = [];
    }

    if (!cpage.attachments) {
      cpage.attachments = [];
    }

    return { paginationRow: row, replyOptions: cpage };
  }
};
