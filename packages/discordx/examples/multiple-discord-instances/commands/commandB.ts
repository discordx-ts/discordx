import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class CommandB {
  @Slash({ description: "hi" })
  hi(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }
}
