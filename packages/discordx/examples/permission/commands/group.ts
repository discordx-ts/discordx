/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { ChatInputCommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";

@Discord()
@SlashGroup({
  defaultMemberPermissions: 0n,
  description: "vital",
  dmPermission: false,
  name: "vital",
})
@SlashGroup("vital")
export class Example {
  @Slash({ description: "perm1" })
  async perm1(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply(":wave:");
  }

  @Slash({ description: "perm2" })
  async perm2(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply(":wave:");
  }
}
