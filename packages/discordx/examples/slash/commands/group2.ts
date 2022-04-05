import type { CommandInteraction } from "discord.js";

import { Discord, Slash, SlashGroup } from "../../../src/index.js";

@Discord()
@SlashGroup({ name: "test-x" })
@SlashGroup({ name: "add", root: "test-x" })
@SlashGroup("add", "test-x")
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Group {
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
@SlashGroup("test-x")
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class AnotherGroup {
  @Slash()
  m(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash()
  n(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }
}
