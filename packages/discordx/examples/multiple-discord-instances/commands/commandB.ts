import type { CommandInteraction } from "discord.js";

import { Discord, Slash } from "../../../src/index.js";

@Discord()
export class CommandB {
  @Slash("hi")
  hello1(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }
}
