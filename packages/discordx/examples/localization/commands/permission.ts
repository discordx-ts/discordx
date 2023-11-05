import type { ChatInputCommandInteraction } from "discord.js";
import { PermissionFlagsBits } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Example {
  @Slash({ defaultMemberPermissions: 0n, description: "perm1" })
  perm1(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash({
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    description: "perm2",
  })
  perm2(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash({
    description: "perm3",
    dmPermission: true,
  })
  perm3(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash({
    description: "perm4",
    dmPermission: true,
    guilds: ["874802018361950248"],
  })
  perm4(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash({
    defaultMemberPermissions: undefined,
    description: "perm5",
    guilds: ["874802018361950248"],
  })
  perm5(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash({
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    description: "perm6",
    guilds: ["874802018361950248"],
  })
  perm6(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }
}
