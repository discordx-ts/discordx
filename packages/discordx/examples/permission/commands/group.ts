/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
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
  perm1(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash({ description: "perm2" })
  perm2(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }
}
