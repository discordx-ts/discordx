import { Discord, Slash } from "../../../src";
import { CommandInteraction } from "discord.js";

@Discord()
export class CommandsB {
  @Slash("hello2")
  hello2(interaction: CommandInteraction) {
    interaction.reply("Hello 2");
  }
}
