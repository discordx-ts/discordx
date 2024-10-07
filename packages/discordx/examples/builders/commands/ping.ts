/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { SlashCommandBuilder, type CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

const cmd = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Reply with pong!");

@Discord()
export class Example {
  @Slash(cmd)
  async ping(interaction: CommandInteraction): Promise<void> {
    await interaction.reply("Pong");
  }
}
