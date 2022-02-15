import type { CommandInteraction } from "discord.js";

import { Discord, Slash, SlashGroup } from "../../../src/index.js";

@Discord()
@SlashGroup({ name: "testx" })
@SlashGroup({ appendToChild: true, name: "add", root: "testx" })
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
@SlashGroup({ appendToChild: true, name: "testx" })
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
