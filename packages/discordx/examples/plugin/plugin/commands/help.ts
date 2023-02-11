import type { CommandInteraction } from "discord.js";

import { Discord, Slash } from "../../../../src/index.js";

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
