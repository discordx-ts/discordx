import { Discord, Slash, SlashOption } from "../../../build/cjs/index.cjs";
import { CommandInteraction } from "discord.js";

@Discord()
export abstract class MinMax {
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
