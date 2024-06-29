/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import {
  AutocompleteInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
  type CommandInteraction,
} from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

const cmd = new SlashCommandBuilder()
  .setName("planet-auto")
  .setDescription("Select a planet");

const planet_option = new SlashCommandStringOption()
  .setName("planet")
  .setDescription("Choose a planet")
  .setRequired(true)
  .setAutocomplete(true);

@Discord()
export class Example {
  @Slash(cmd)
  async hello(
    @SlashOption(planet_option) planet: string,
    interaction: CommandInteraction | AutocompleteInteraction,
  ): Promise<void> {
    if (interaction.isAutocomplete()) {
      interaction.respond([
        { name: "Earth", value: "Earth" },
        { name: "Mars", value: "Mars" },
      ]);
    } else {
      await interaction.reply(`:rocket: going to ${planet}`);
    }
  }
}
