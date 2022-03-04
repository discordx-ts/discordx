import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";

import { Discord, Slash, SlashOption } from "../../../src/index.js";

@Discord()
export abstract class MinMax {
  @Slash("minmax-min")
  min(
    @SlashOption("value", {
      minValue: 5,
      type: ApplicationCommandOptionType.Number,
    })
    input: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${input}`);
  }

  @Slash("minmax-max")
  max(
    @SlashOption("value", {
      maxValue: 5,
      type: ApplicationCommandOptionType.Number,
    })
    input: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${input}`);
  }

  @Slash("minmax-both")
  MinMax(
    @SlashOption("value", {
      maxValue: 15,
      minValue: 5,
      type: ApplicationCommandOptionType.Number,
    })
    input: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${input}`);
  }
}
