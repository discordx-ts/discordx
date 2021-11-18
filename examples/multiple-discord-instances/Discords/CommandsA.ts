import { Discord, Slash } from "../../../build/cjs/index.cjs";
import { CommandInteraction } from "discord.js";

@Discord()
export class CommandsB {
  @Slash("hello2")
  hello2(interaction: CommandInteraction): void {
    interaction.reply("Hello 2");
  }
}
