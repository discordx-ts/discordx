import type { CommandInteraction } from "discord.js";

import { Discord, Slash, SlashGroup } from "../../../src/index.js";

@Discord()
@SlashGroup({ name: "testx" })
@SlashGroup({ name: "add", root: "testx" })
@SlashGroup("add", "testx")
export abstract class Group {
  @Slash()
  x(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash()
  y(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }
}

@Discord()
@SlashGroup("testx")
export abstract class AnotherGroup {
  @Slash()
  m(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash()
  n(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }
}
