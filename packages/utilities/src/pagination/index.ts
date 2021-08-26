import {
  InteractionReplyOptions,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
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
  embeds: (MessageEmbed | { content?: string; embed: MessageEmbed })[],
  options?: PaginationOptions
): Promise<void> {
  const option = options ?? { type: "BUTTON" };
  let currentPage = option.initialPage ?? 0;

  const pageOptions = (page: number): InteractionReplyOptions => {
    const beginning = page === 0;
    const end = page === embeds.length - 1;
    const currentEmbedEx = embeds[page];

    if (!currentEmbedEx) {
      throw new Error("Embed page number out of bounds");
    }

    const currentEmbed =
      currentEmbedEx instanceof MessageEmbed
        ? currentEmbedEx
        : currentEmbedEx.embed;

    const content =
      currentEmbedEx instanceof MessageEmbed
        ? option.content
        : currentEmbedEx.content ?? option.content;

    if (option.showPagePosition ?? true) {
      currentEmbed.setFooter(`Page ${page + 1} of ${embeds.length}`);
    }

    if (option.type === "BUTTON") {
      const buttonStyle = option.style ?? "PRIMARY";

      const optionOne = new MessageButton()
        .setCustomId(option.nextLabel ?? defaultIds.nextButton)
        .setLabel(option.nextLabel ?? "Next")
        .setStyle(buttonStyle);

      if (end) {
        optionOne.disabled = true;
      }

      const optionTwo = new MessageButton()
        .setCustomId(option.previousButtonId ?? defaultIds.previousButton)
        .setLabel(option.previousLabel ?? "Previous")
        .setStyle(buttonStyle);

      if (beginning) {
        optionTwo.disabled = true;
      }

      const row = new MessageActionRow().addComponents([optionTwo, optionOne]);

      return {
        content,
        embeds: [currentEmbed],
        components: [row],
      };
    } else {
      const paginator = paginate(embeds.length, page, 1, 21).pages.map((i) => {
        const selectMenuOption: MessageSelectOptionData = {
          label: `page ${i}`,
          value: (i - 1).toString(),
        };
        return selectMenuOption;
      });

      if (embeds.length > 21) {
        if (page > 10) {
          paginator.unshift({ label: "Start", value: "-1" });
        }
        if (page < embeds.length - 10) {
          paginator.push({ label: "End", value: "-2" });
        }
      }

      const menu = new MessageSelectMenu()
        .setCustomId(option.menuId ?? defaultIds.menuId)
        .setPlaceholder("Select page")
        .setOptions(paginator);

      const row = new MessageActionRow().addComponents([menu]);

      return {
        content,
        embeds: [currentEmbed],
        components: [row],
      };
    }
  };

  const messageOptions = pageOptions(currentPage);
  const message =
    interaction.deferred || interaction.replied
      ? await interaction.followUp({
          ...messageOptions,
          ephemeral: option.ephemeral,
          fetchReply: true,
        })
      : await interaction.reply({
          ...messageOptions,
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
          (option.nextButtonId ?? defaultIds.nextButton)
      ) {
        currentPage++;
      } else if (
        option.type === "BUTTON" &&
        collectInteraction.customId ===
          (option.previousButtonId ?? defaultIds.previousButton)
      ) {
        currentPage--;
      } else {
        return;
      }

      await collectInteraction.deferUpdate();
      const replyOptions = pageOptions(currentPage);
      await collectInteraction.editReply(replyOptions);
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
      const replyOptions = pageOptions(currentPage);
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
