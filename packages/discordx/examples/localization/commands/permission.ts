import type { ChatInputCommandInteraction } from "discord.js";
import { PermissionFlagsBits } from "discord.js";

import { Discord, Slash } from "../../../src/index.js";

@Discord()
export class Example {
  @Slash({ defaultMemberPermissions: BigInt(0) })
  perm1(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash({
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
  })
  perm2(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash({
    dmPermission: true,
  })
  perm3(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash({
    dmPermission: true,
    guilds: ["874802018361950248"],
  })
  perm4(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash({
    defaultMemberPermissions: undefined,
    guilds: ["874802018361950248"],
  })
  perm5(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash({
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    guilds: ["874802018361950248"],
  })
  perm6(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }
}
