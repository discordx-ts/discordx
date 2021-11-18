import { IGeneratePage, PaginationOptions, defaultIds } from "../types.mjs";
import {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageOptions,
  MessageSelectMenu,
  MessageSelectOptionData,
} from "discord.js";
import { paginate } from "./paginate.mjs";

export const GeneratePage = (
  embed: string | MessageEmbed | MessageOptions,
  page: number,
  totalPages: number,
  option: PaginationOptions
): IGeneratePage => {
  const beginning = page === 0;
  const end = page === totalPages - 1;

  const cpage: MessageOptions =
    typeof embed === "string"
      ? { content: embed }
      : embed instanceof MessageEmbed
      ? { embeds: [embed] }
      : embed;

  if (option.type === "BUTTON") {
    const startBtn = new MessageButton()
      .setCustomId(option.start?.id ?? defaultIds.buttons.start)
      .setLabel(option.start?.label ?? "Start")
      .setStyle(option.start?.style ?? "PRIMARY")
      .setDisabled(beginning);

    const endBtn = new MessageButton()
      .setCustomId(option.end?.id ?? defaultIds.buttons.end)
      .setLabel(option.end?.label ?? "End")
      .setStyle(option.end?.style ?? "PRIMARY")
      .setDisabled(end);

    const nextBtn = new MessageButton()
      .setCustomId(option.next?.id ?? defaultIds.buttons.next)
      .setLabel(option.next?.label ?? "Next")
      .setStyle(option.next?.style ?? "PRIMARY")
      .setDisabled(end);

    const prevBtn = new MessageButton()
      .setCustomId(option.previous?.id ?? defaultIds.buttons.previous)
      .setLabel(option.previous?.label ?? "Previous")
      .setStyle(option.previous?.style ?? "PRIMARY")
      .setDisabled(beginning);

    const exitBtn = new MessageButton()
      .setCustomId(option.exit?.id ?? defaultIds.buttons.exit)
      .setLabel(option.exit?.label ?? "Exit")
      .setStyle(option.exit?.style ?? "DANGER");

    const buttons: MessageButton[] = [prevBtn, nextBtn];

    if (totalPages > 10 && (option.showStartEnd ?? true)) {
      buttons.unshift(startBtn);
      buttons.push(endBtn);
    }

    if (option.enableExit) {
      buttons.push(exitBtn);
    }

    const row = new MessageActionRow().addComponents(buttons);

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
      const selectMenuOption: MessageSelectOptionData = {
        label: (
          (option.pageText instanceof Array
            ? option.pageText[i - 1]
            : option.pageText) ?? "Page {page}"
        ).replaceAll("{page}", `${i}`),
        value: (i - 1).toString(),
      };
      return selectMenuOption;
    });

    if (totalPages > 21 && (option.showStartEnd ?? true)) {
      if (page > 10) {
        paginator.unshift({
          label: option.labels?.start ?? "Start",
          value: "-1",
        });
      }
      if (page < totalPages - 10) {
        paginator.push({ label: option.labels?.end ?? "End", value: "-2" });
      }
    }

    if (option.enableExit) {
      paginator.push({
        label: option.labels?.exit ?? "Exit Pagination",
        value: "-3",
      });
    }

    const menu = new MessageSelectMenu()
      .setCustomId(option.menuId ?? defaultIds.menu)
      .setPlaceholder(option.placeholder ?? "Select page")
      .setOptions(paginator);

    const row = new MessageActionRow().addComponents([menu]);

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
