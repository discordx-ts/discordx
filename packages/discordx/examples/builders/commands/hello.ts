/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import {
  SlashCommandBuilder,
  SlashCommandMentionableOption,
  User,
  type CommandInteraction,
} from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

const cmd = new SlashCommandBuilder()
  .setName("hello")
  .setDescription("Say hello!");

const user_option = new SlashCommandMentionableOption()
  .setName("user")
  .setDescription("Mention user to say hello to.")
  .setRequired(true);

@Discord()
export class Example {
  @Slash(cmd)
  async hello(
    @SlashOption(user_option) user: User,
    interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.reply(`:wave: ${user}`);
  }
}
