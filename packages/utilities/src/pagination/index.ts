import {
  InteractionReplyOptions,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
  MessageSelectOptionData,
} from "discord.js";
import { PaginationInteractions, PaginationOptions } from "./types";

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
  let currentPage = options?.initialPage ?? 0;

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
        ? options?.content
        : currentEmbedEx.content ?? options?.content;

    if (options?.showPagePosition ?? true) {
      currentEmbed.setFooter(`Page ${page + 1} of ${embeds.length}`);
    }

    console.log(currentEmbed.footer);

    if (options?.type === "BUTTON") {
      const buttonStyle = options?.style ?? "PRIMARY";

      const optionOne = new MessageButton()
        .setCustomId("discordx@nextButton")
        .setLabel(options?.nextLabel ?? "Next")
        .setStyle(buttonStyle);

      if (end) {
        optionOne.disabled = true;
      }

      const optionTwo = new MessageButton()
        .setCustomId("discordx@previousButton")
        .setLabel(options?.previousLabel ?? "Previous")
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
      const option = new MessageSelectMenu()
        .setCustomId("discordx@pagination@menu")
        .setPlaceholder("Select page")
        .setOptions(
          Array.from(Array(embeds.length).keys()).map((i) => {
            const option: MessageSelectOptionData = {
              label: `page ${i + 1}`,
              value: i.toString(),
            };
            return option;
          })
        );

      const row = new MessageActionRow().addComponents([option]);

      return {
        content,
        embeds: [currentEmbed],
        components: [row],
      };
    }
  };

  const messageOptions = pageOptions(currentPage);
  const message = interaction.deferred
    ? await interaction.followUp({
        ...messageOptions,
        fetchReply: true,
      })
    : await interaction.reply({
        ...messageOptions,
        fetchReply: true,
      });

  if (!(message instanceof Message)) {
    throw Error("InvalidMessage instance");
  }

  const collector = message.createMessageComponentCollector({
    componentType: options?.type ?? "BUTTON",
    time: options?.time ?? defaultTime,
  });

  collector.on("collect", async (collectInteraction) => {
    if (collectInteraction.isButton()) {
      if (collectInteraction.customId === "discordx@nextButton") {
        currentPage++;
      } else if (collectInteraction.customId === "discordx@previousButton") {
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
      collectInteraction.customId === "discordx@pagination@menu"
    ) {
      await collectInteraction.deferUpdate();
      const currentPage = Number(collectInteraction.values[0] ?? "0");
      const replyOptions = pageOptions(currentPage);
      await collectInteraction.editReply(replyOptions);
    }
  });

  collector.on("end", async () => {
    if (!message.editable) {
      return;
    }
    if (options?.showPagePosition ?? true) {
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
