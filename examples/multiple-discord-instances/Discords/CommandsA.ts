import { Discord, Slash } from "../../../src/index.js";
import { CommandInteraction } from "discord.js";

@Discord()
export class CommandsB {
  @Slash("hello2")
  hello2(interaction: CommandInteraction): void {
    interaction.reply("Hello 2");
  }
}
