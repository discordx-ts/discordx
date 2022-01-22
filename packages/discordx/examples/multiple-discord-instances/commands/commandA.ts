import { Discord, Slash } from "../../../src/index.js";
import { CommandInteraction } from "discord.js";

@Discord()
export class CommandA {
  @Slash("hello")
  hello1(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }
}
