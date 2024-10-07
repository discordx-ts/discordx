/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";

@Discord()
@SlashGroup({ description: "test-x", name: "test-x" })
@SlashGroup("test-x")
export class AnotherGroup {
  @Slash({ description: "m" })
  async m(interaction: CommandInteraction): Promise<void> {
    await interaction.reply(":wave:");
  }

  @Slash({ description: "n" })
  async n(interaction: CommandInteraction): Promise<void> {
    await interaction.reply(":wave:");
  }
}

@Discord()
@SlashGroup("test-x")
export class ExpendAnotherGroup {
  @Slash({ description: "x" })
  async x(interaction: CommandInteraction): Promise<void> {
    await interaction.reply(":wave:");
  }
}

@Discord()
@SlashGroup({ description: "add", name: "add", root: "test-x" })
@SlashGroup("add", "test-x")
export class Group {
  @Slash({ description: "y" })
  async x(interaction: CommandInteraction): Promise<void> {
    await interaction.reply(":wave:");
  }

  @Slash({ description: "y" })
  async y(interaction: CommandInteraction): Promise<void> {
    await interaction.reply(":wave:");
  }
}

@Discord()
@SlashGroup({ description: "test-y", name: "test-y" })
@SlashGroup({ description: "test-y", name: "add", root: "test-y" })
@SlashGroup("test-y")
export class DuplicateGroup {
  @Slash({ description: "o" })
  async o(interaction: CommandInteraction): Promise<void> {
    await interaction.reply(":wave:");
  }

  @Slash({ description: "p" })
  async p(interaction: CommandInteraction): Promise<void> {
    await interaction.reply(":wave:");
  }

  @Slash({ description: "y" })
  @SlashGroup("add", "test-y")
  async y(interaction: CommandInteraction): Promise<void> {
    await interaction.reply(":wave:");
  }

  @Slash({ description: "z" })
  @SlashGroup("add", "test-y")
  async z(interaction: CommandInteraction): Promise<void> {
    await interaction.reply(":wave:");
  }
}
