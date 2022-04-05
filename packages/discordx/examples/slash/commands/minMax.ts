import type { CommandInteraction } from "discord.js";

import { Discord, Slash, SlashOption } from "../../../src/index.js";

@Discord()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MinMaxExample {
  @Slash("minmax-min")
  min(
    @SlashOption("value", {
      minValue: 5,
      type: "NUMBER",
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
      type: "NUMBER",
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
      type: "NUMBER",
    })
    input: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${input}`);
  }
}
