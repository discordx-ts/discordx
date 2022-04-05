import type { CommandInteraction } from "discord.js";

import { Bot, Discord, Slash } from "../../../src/index.js";

@Discord()
@Bot("botA") // A bot id is crucial
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Example {
  @Slash("hello")
  root(interaction: CommandInteraction): void {
    interaction.reply("I am bot A.");
  }
}
