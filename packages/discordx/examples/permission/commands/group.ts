import type { ChatInputCommandInteraction } from "discord.js";

import { Discord, Slash, SlashGroup } from "../../../src/index.js";

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
