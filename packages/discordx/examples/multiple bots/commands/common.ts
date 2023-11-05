import type { CommandInteraction } from "discord.js";
import { Bot, Discord, Slash } from "discordx";

@Discord()
@Bot("botA", "botB") // A bot id is crucial
export class Example {
  @Slash({ description: "shared" })
  shared(interaction: CommandInteraction): void {
    interaction.reply("This is a shared command and can be used by both bots");
  }
}
