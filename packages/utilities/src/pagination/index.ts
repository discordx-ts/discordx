import {
  InteractionReplyOptions,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageOptions,
  MessageSelectMenu,
  MessageSelectOptionData,
} from "discord.js";
import { PaginationInteractions, PaginationOptions, defaultIds } from "./types";
import { paginate } from "./paginate";

// By default, it's half an hour.
const defaultTime = 1800000;

/**
 * send paginated embeds
 * @param interaction
 * @param embeds
 * @param options
 */
export async function sendPaginatedEmbeds(
  interaction: PaginationInteractions,
  embeds: (string | MessageEmbed | MessageOptions)[],
  options?: PaginationOptions
): Promise<void> {
  const option = options ?? { type: "BUTTON" };
  let currentPage = option.initialPage ?? 0;

  const allPages = embeds.map((embed, index) =>
    GeneratePage(embed, index, embeds.length, option)
  );

  const replyOptions = allPages[currentPage];
  const message =
    interaction.deferred || interaction.replied
      ? await interaction.followUp({
          ...replyOptions,
          ephemeral: option.ephemeral,
          fetchReply: true,
        })
      : await interaction.reply({
          ...replyOptions,
          ephemeral: option.ephemeral,
          fetchReply: true,
        });

  if (!(message instanceof Message)) {
    throw Error("InvalidMessage instance");
  }

  const collector = message.createMessageComponentCollector({
    componentType: option.type ?? "BUTTON",
    time: option.time ?? defaultTime,
  });

  collector.on("collect", async (collectInteraction) => {
    if (collectInteraction.isButton()) {
      if (
        option.type === "BUTTON" &&
        collectInteraction.customId ===
          (option.startId ?? defaultIds.startButton)
      ) {
        currentPage = 0;
      } else if (
        option.type === "BUTTON" &&
        collectInteraction.customId === (option.endId ?? defaultIds.endButton)
      ) {
        currentPage = embeds.length - 1;
      } else if (
        option.type === "BUTTON" &&
        collectInteraction.customId === (option.nextId ?? defaultIds.nextButton)
      ) {
        currentPage++;
      } else if (
        option.type === "BUTTON" &&
        collectInteraction.customId ===
          (option.previousId ?? defaultIds.previousButton)
      ) {
        currentPage--;
      } else {
        return;
      }

      await collectInteraction.deferUpdate();
      const messageOptions = allPages[currentPage];
      if (!messageOptions) throw Error("out of bound page");
      if (!messageOptions.embeds) messageOptions.embeds = [];
      await collectInteraction.editReply(messageOptions);
    }
    if (
      collectInteraction.isSelectMenu() &&
      option.type === "SELECT_MENU" &&
      collectInteraction.customId === (option.menuId ?? defaultIds.menuId)
    ) {
      await collectInteraction.deferUpdate();
      currentPage = Number(collectInteraction.values[0] ?? "0");
      if (currentPage === -1) currentPage = 0;
      if (currentPage === -2) currentPage = embeds.length - 1;

      const replyOptions = allPages[currentPage];
      if (!replyOptions) throw Error("out of bound page");
      await collectInteraction.editReply(replyOptions);
    }
  });

  collector.on("end", async () => {
    if (!message.editable || message.deleted) {
      return;
    }
    if (option.showPagePosition ?? true) {
      const [embed] = message.embeds;

      if (embed) {
        embed.footer = null;
        await message.edit({ components: [], embeds: [embed] });
        return;
      }
    }

    await message.edit({ components: [] });
  });
}

const GeneratePage = (
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
      const selectMenuOption: MessageSelectOptionData = {
        label: `page ${i}`,
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

    const menu = new MessageSelectMenu()
      .setCustomId(option.menuId ?? defaultIds.menuId)
      .setPlaceholder("Select page")
      .setOptions(paginator);

    const row = new MessageActionRow().addComponents([menu]);

    if (cpage.components) cpage.components.push(row);
    else cpage.components = [row];

    return cpage;
  }
};
