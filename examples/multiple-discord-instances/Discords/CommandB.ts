import { Discord, Slash } from "../../../build/cjs/index.js";
import { CommandInteraction } from "discord.js";

@Discord()
export class CommandB {
  @Slash("hi")
  hello1(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }
}
