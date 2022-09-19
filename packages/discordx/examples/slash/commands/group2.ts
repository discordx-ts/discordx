import type { CommandInteraction } from "discord.js";

import { Discord, Slash, SlashGroup } from "../../../src/index.js";

@Discord()
@SlashGroup({ name: "test-x" })
@SlashGroup("test-x")
export class AnotherGroup {
  @Slash()
  m(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash()
  n(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }
}

@Discord()
@SlashGroup("test-x")
export class ExpendAnotherGroup {
  @Slash()
  x(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }
}

@Discord()
@SlashGroup({ name: "add", root: "test-x" })
@SlashGroup("add", "test-x")
export class Group {
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
@SlashGroup({ name: "test-y" })
@SlashGroup({ name: "add", root: "test-y" })
@SlashGroup("test-y")
export class DuplicateGroup {
  @Slash()
  o(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash()
  p(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash()
  @SlashGroup("add", "test-y")
  y(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash()
  @SlashGroup("add", "test-y")
  z(interaction: CommandInteraction): void {
    interaction.reply(":wave:");
  }
}
