import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

@Discord()
export class MinMaxExample {
  @Slash({ description: "minmax-min", name: "minmax-min" })
  min(
    @SlashOption({
      description: "input",
      name: "input",
      required: true,
      type: ApplicationCommandOptionType.Number,
    })
    input: number,
    interaction: CommandInteraction,
  ): void {
    interaction.reply(`${input}`);
  }

  @Slash({ description: "minmax-max", name: "minmax-max" })
  max(
    @SlashOption({
      description: "value",
      maxValue: 5,
      name: "value",
      required: true,
      type: ApplicationCommandOptionType.Number,
    })
    input: number,
    interaction: CommandInteraction,
  ): void {
    interaction.reply(`${input}`);
  }

  @Slash({ description: "minmax-both", name: "minmax-both" })
  MinMax(
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
  ): void {
    interaction.reply(`${input}`);
  }
}
