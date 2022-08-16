import type { ChatInputCommandInteraction } from "discord.js";

import { Discord, Slash, SlashGroup } from "../../../src/index.js";

@Discord()
@SlashGroup({
  defaultMemberPermissions: 0n,
  dmPermission: false,
  name: "vital",
})
@SlashGroup("vital")
export class Example {
  @Slash()
  perm1(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash()
  perm2(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }
}
