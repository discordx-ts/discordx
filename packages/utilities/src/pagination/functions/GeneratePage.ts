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
): InteractionReplyOptions => {
  // const footer = `Page ${page + 1} of ${embeds.length}`;
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

    if (cpage.components) cpage.components.push(row);
    else cpage.components = [row];

    return cpage;
  } else {
    const paginator = paginate(totalPages, page, 1, 21).pages.map((i) => {
      // const selectMenuOption: MessageSelectOptionData = {
      const selectMenuOption: MessageSelectOptionData = {
        label: (option.pageText ?? "Page {page}").replaceAll("{page}", `${i}`),
        value: (i - 1).toString(),
      };
      return selectMenuOption;
    });

    if (totalPages > 21) {
      if (page > 10) {
        paginator.unshift({ label: "Start", value: "-1" });
      }
      if (page < totalPages - 10) {
        paginator.push({ label: "End", value: "-2" });
      }
    }

    // const menu = new MessageSelectMenu()  // v13.2.0
    const menu = new MessageSelectMenu({ options: paginator })
      .setCustomId(option.menuId ?? defaultIds.menuId)
      .setPlaceholder("Select page");
    // .setOptions(paginator); // v13.2.0

    const row = new MessageActionRow().addComponents([menu]);

    if (cpage.components) cpage.components.push(row);
    else cpage.components = [row];

    // reset message payload additional parameters
    if (!cpage.embeds) cpage.embeds = [];
    if (!cpage.files) cpage.files = [];
    if (!cpage.stickers) cpage.stickers = [];
    // if (!cpage.files) cpage.files = []; // v13.1.0
    // if (!cpage.attachments) cpage.attachments = []; // v13.2.0
    return cpage;
  }
};
