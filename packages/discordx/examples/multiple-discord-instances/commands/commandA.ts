import type { CommandInteraction } from "discord.js";

import { Discord, Slash } from "../../../src/index.js";

@Discord()
export class CommandA {
  @Slash()
  hello(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }
}
