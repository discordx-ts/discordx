/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import {
  SlashCommandBuilder,
  SlashCommandStringOption,
  type CommandInteraction,
} from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

const cmd = new SlashCommandBuilder()
  .setName("planet")
  .setDescription("Select a planet");

const planet_option = new SlashCommandStringOption()
  .setName("planet")
  .setDescription("Choose a planet")
  .setRequired(true)
  .addChoices([
    { name: "Earth", value: "Earth" },
    { name: "Mars", value: "Mars" },
  ]);

@Discord()
export class Example {
  @Slash(cmd)
  async hello(
    @SlashOption(planet_option) planet: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.reply(`:rocket: going to ${planet}`);
  }
}
