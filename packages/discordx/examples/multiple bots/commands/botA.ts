import type { CommandInteraction } from "discord.js";

import { Bot, Discord, Slash } from "../../../src/index.js";

@Discord()
@Bot("botA") // A bot id is crucial
export class Example {
  @Slash({ description: "hello" })
  hello(interaction: CommandInteraction): void {
    interaction.reply("I am bot A.");
  }
}
