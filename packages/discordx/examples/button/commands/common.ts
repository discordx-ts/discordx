import type { ButtonInteraction, CommandInteraction } from "discord.js";
import { MessageActionRow, MessageButton } from "discord.js";

import { ButtonComponent, Discord, Slash } from "../../../src/index.js";

@Discord()
export class Example {
  @ButtonComponent("hello")
  handler(interaction: ButtonInteraction): void {
    interaction.reply(":wave:");
  }

  @ButtonComponent("hello")
  handler2(interaction: ButtonInteraction): void {
    console.log(`${interaction.user} says hello`);
  }

  @Slash()
  test(interaction: CommandInteraction): void {
    const btn = new MessageButton()
      .setLabel("Hello")
      .setStyle("PRIMARY")
      .setCustomId("hello");

    const buttonRow = new MessageActionRow().addComponents(btn);

    interaction.reply({
      components: [buttonRow],
    });
  }
}
