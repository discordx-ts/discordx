/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type {
  ButtonInteraction,
  CommandInteraction,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { ButtonComponent, Discord, Slash } from "discordx";

@Discord()
export class Example {
  @ButtonComponent({ id: "hello" })
  async handler(interaction: ButtonInteraction): Promise<void> {
    await interaction.reply(":wave:");
  }

  @ButtonComponent({ id: "hello" })
  handler2(interaction: ButtonInteraction): void {
    console.log(`${interaction.user.toString()} says hello`);
  }

  @Slash({ description: "test" })
  async test(interaction: CommandInteraction): Promise<void> {
    const btn = new ButtonBuilder()
      .setLabel("Hello")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("hello");

    const buttonRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        btn,
      );

    await interaction.reply({
      components: [buttonRow],
    });
  }
}
