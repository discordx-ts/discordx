import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Example {
  @Slash({
    description: "help command",
    name: "help",
  })
  help(interaction: CommandInteraction): void {
    interaction.reply("I am help command xd.");
  }
}
