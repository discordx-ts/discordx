import {
  InteractionReplyOptions,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageOptions,
  MessageSelectMenu,
  MessageSelectOptionData,
} from "discord.js";
import { PaginationOptions, defaultIds } from "../types";
import { paginate } from "./paginate";

export const GeneratePage = (
  embed: string | MessageEmbed | MessageOptions,
  page: number,
  totalPages: number,
  option: PaginationOptions
): {
  paginationRow: MessageActionRow;
  replyOptions: InteractionReplyOptions;
} => {
  const beginning = page === 0;
  const end = page === totalPages - 1;

  const cpage: MessageOptions =
    typeof embed === "string"
      ? { content: embed }
      : embed instanceof MessageEmbed
      ? { embeds: [embed] }
      : embed;

  if (option.type === "BUTTON") {
    const buttonStyle = option.style ?? "PRIMARY";

    const startBtn = new MessageButton()
      .setCustomId(option.startId ?? defaultIds.startButton)
      .setLabel(option.startLabel ?? "Start")
      .setStyle(buttonStyle);

    if (beginning) {
      startBtn.disabled = true;
    }

    const endBtn = new MessageButton()
      .setCustomId(option.endId ?? defaultIds.endButton)
      .setLabel(option.endLabel ?? "End")
      .setStyle(buttonStyle);

    if (end) {
      endBtn.disabled = true;
    }

    const nextBtn = new MessageButton()
      .setCustomId(option.nextId ?? defaultIds.nextButton)
      .setLabel(option.nextLabel ?? "Next")
      .setStyle(buttonStyle);

    if (end) {
      nextBtn.disabled = true;
    }

    const prevBtn = new MessageButton()
      .setCustomId(option.previousId ?? defaultIds.previousButton)
      .setLabel(option.previousLabel ?? "Previous")
      .setStyle(buttonStyle);

    if (beginning) {
      prevBtn.disabled = true;
    }

    const row = new MessageActionRow().addComponents(
      totalPages > 10 && (option.startEndButtons ?? true)
        ? [startBtn, prevBtn, nextBtn, endBtn]
        : [prevBtn, nextBtn]
    );

    // reset message payload additional parameters
    if (!cpage.embeds) {
      cpage.embeds = [];
    }

    if (!cpage.files) {
      cpage.files = [];
    }

    if (!cpage.stickers) {
      cpage.stickers = [];
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

    if (totalPages > 21) {
      if (page > 10) {
        paginator.unshift({ label: option.startLabel ?? "Start", value: "-1" });
      }
      if (page < totalPages - 10) {
        paginator.push({ label: option.endLabel ?? "End", value: "-2" });
      }
    }

    const menu = new MessageSelectMenu()
      .setCustomId(option.menuId ?? defaultIds.menuId)
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

    if (!cpage.stickers) {
      cpage.stickers = [];
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
