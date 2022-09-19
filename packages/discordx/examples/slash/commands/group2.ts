import type { CommandInteraction } from "discord.js";

import { Discord, Slash, SlashGroup } from "../../../src/index.js";

@Discord()
@SlashGroup({ description: "test-x", name: "test-x" })
@SlashGroup("test-x")
export class AnotherGroup {
  @Slash({ description: "m" })
  m(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash({ description: "n" })
  n(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }
}

@Discord()
@SlashGroup("test-x")
export class ExpendAnotherGroup {
  @Slash({ description: "x" })
  x(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }
}

@Discord()
@SlashGroup({ description: "add", name: "add", root: "test-x" })
@SlashGroup("add", "test-x")
export class Group {
  @Slash({ description: "y" })
  x(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash({ description: "y" })
  y(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }
}

@Discord()
@SlashGroup({ description: "test-y", name: "test-y" })
@SlashGroup({ description: "test-y", name: "add", root: "test-y" })
@SlashGroup("test-y")
export class DuplicateGroup {
  @Slash({ description: "o" })
  o(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash({ description: "p" })
  p(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash({ description: "y" })
  @SlashGroup("add", "test-y")
  y(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash({ description: "z" })
  @SlashGroup("add", "test-y")
  z(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }
}
