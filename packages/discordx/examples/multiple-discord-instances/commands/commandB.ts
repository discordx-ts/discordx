import type { CommandInteraction } from "discord.js";

import { Discord, Slash } from "../../../src/index.js";

@Discord()
export class CommandB {
  @Slash({ description: "hi" })
  hi(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }
}
