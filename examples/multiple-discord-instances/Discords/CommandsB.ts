import { Discord, Slash } from "../../../build/cjs/index.js";
import { CommandInteraction } from "discord.js";

@Discord()
export class CommandsB {
  @Slash("hello")
  hello(interaction: CommandInteraction): void {
    interaction.reply("Hello 1");
  }
}
