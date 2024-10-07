/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

@Discord()
export class MinMaxExample {
  @Slash({ description: "minmax-min", name: "minmax-min" })
  async min(
    @SlashOption({
      description: "input",
      name: "input",
      required: true,
      type: ApplicationCommandOptionType.Number,
    })
    input: number,
    interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.reply(input.toString());
  }

  @Slash({ description: "minmax-max", name: "minmax-max" })
  async max(
    @SlashOption({
      description: "value",
      maxValue: 5,
      name: "value",
      required: true,
      type: ApplicationCommandOptionType.Number,
    })
    input: number,
    interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.reply(input.toString());
  }

  @Slash({ description: "minmax-both", name: "minmax-both" })
  async MinMax(
    @SlashOption({
      description: "value",
      maxValue: 15,
      minValue: 5,
      name: "value",
      required: true,
      type: ApplicationCommandOptionType.Number,
    })
    input: number,
    interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.reply(input.toString());
  }
}
