import { Bot, Discord, Slash } from "../../../build/cjs/index.cjs";
import { CommandInteraction } from "discord.js";

@Discord()
@Bot("botA", "botB") // A bot id is crucial
export abstract class AppDiscord {
  @Slash("shared")
  root(interaction: CommandInteraction): void {
    interaction.reply("This is a shared command and can be used by both bots");
  }
}
