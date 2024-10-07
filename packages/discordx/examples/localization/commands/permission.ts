/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { ChatInputCommandInteraction } from "discord.js";
import { PermissionFlagsBits } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Example {
  @Slash({ defaultMemberPermissions: 0n, description: "perm1" })
  async perm1(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply(":wave:");
  }

  @Slash({
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    description: "perm2",
  })
  async perm2(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply(":wave:");
  }

  @Slash({
    description: "perm3",
    dmPermission: true,
  })
  async perm3(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply(":wave:");
  }

  @Slash({
    description: "perm4",
    dmPermission: true,
    guilds: ["874802018361950248"],
  })
  async perm4(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply(":wave:");
  }

  @Slash({
    defaultMemberPermissions: undefined,
    description: "perm5",
    guilds: ["874802018361950248"],
  })
  async perm5(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply(":wave:");
  }

  @Slash({
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    description: "perm6",
    guilds: ["874802018361950248"],
  })
  async perm6(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply(":wave:");
  }
}
