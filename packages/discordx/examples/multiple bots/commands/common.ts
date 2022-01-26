import type { CommandInteraction } from "discord.js";

import { Bot, Discord, Slash } from "../../../src/index.js";

@Discord()
@Bot("botA", "botB") // A bot id is crucial
export abstract class AppDiscord {
  @Slash("shared")
  root(interaction: CommandInteraction): void {
    interaction.reply("This is a shared command and can be used by both bots");
  }
}
