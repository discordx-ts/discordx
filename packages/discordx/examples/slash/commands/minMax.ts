import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";

import { Discord, Slash, SlashOption } from "../../../src/index.js";

@Discord()
export class MinMaxExample {
  @Slash({ name: "minmax-min" })
  min(
    @SlashOption({
      minValue: 5,
      name: "value",
      type: ApplicationCommandOptionType.Number,
    })
    input: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${input}`);
  }

  @Slash({ name: "minmax-max" })
  max(
    @SlashOption({
      maxValue: 5,
      name: "value",
      type: ApplicationCommandOptionType.Number,
    })
    input: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${input}`);
  }

  @Slash({ name: "minmax-both" })
  MinMax(
    @SlashOption({
      maxValue: 15,
      minValue: 5,
      name: "value",
      type: ApplicationCommandOptionType.Number,
    })
    input: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${input}`);
  }
}
