import { Discord, Slash } from "../../../src";
import { CommandInteraction } from "discord.js";

@Discord()
export class CommandsB {
  @Slash("hello")
  hello(interaction: CommandInteraction): void {
    interaction.reply("Hello 1");
  }
}
