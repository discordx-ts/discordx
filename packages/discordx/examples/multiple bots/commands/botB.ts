import type { CommandInteraction } from "discord.js";

import { Bot, Discord, Slash } from "../../../src/index.js";

@Discord()
@Bot("botB") // A bot id is crucial
export abstract class AppDiscord {
  @Slash("hello")
  root(interaction: CommandInteraction): void {
    interaction.reply("I am bot B.");
  }
}
