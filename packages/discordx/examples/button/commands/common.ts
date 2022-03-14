import type { ButtonInteraction, CommandInteraction } from "discord.js";
import { MessageActionRow, MessageButton } from "discord.js";

import { ButtonComponent, Discord, Slash } from "../../../src/index.js";

@Discord()
export class Example {
  @ButtonComponent("my-btn")
  handler(interaction: ButtonInteraction): void {
    interaction.reply(":wave:");
  }

  @ButtonComponent("my-btn")
  handler2(interaction: ButtonInteraction): void {
    interaction.channel?.send("it's me");
  }

  @Slash()
  test(interaction: CommandInteraction): void {
    const btn = new MessageButton()
      .setLabel("Hello")
      .setStyle("PRIMARY")
      .setCustomId("my-btn");

    const buttonRow = new MessageActionRow().addComponents(btn);

    interaction.reply({
      components: [buttonRow],
    });
  }
}
