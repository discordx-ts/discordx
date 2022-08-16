import type {
  ButtonInteraction,
  CommandInteraction,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

import { ButtonComponent, Discord, Slash } from "../../../src/index.js";

@Discord()
export class Example {
  @ButtonComponent({ id: "hello" })
  handler(interaction: ButtonInteraction): void {
    interaction.reply(":wave:");
  }

  @ButtonComponent({ id: "hello" })
  handler2(interaction: ButtonInteraction): void {
    console.log(`${interaction.user} says hello`);
  }

  @Slash()
  test(interaction: CommandInteraction): void {
    const btn = new ButtonBuilder()
      .setLabel("Hello")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("hello");

    const buttonRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        btn
      );

    interaction.reply({
      components: [buttonRow],
    });
  }
}
