import type { ChatInputCommandInteraction } from "discord.js";
import { PermissionFlagsBits } from "discord.js";

import { Discord, Slash } from "../../../src/index.js";

@Discord()
export class Example {
  @Slash("perm1", { defaultMemberPermissions: BigInt(0) })
  perm1(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash("perm2", {
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
  })
  perm2(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash("perm3", {
    dmPermission: true,
  })
  perm3(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash("perm4", {
    dmPermission: true,
    guilds: ["874802018361950248"],
  })
  perm4(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash("perm5", {
    defaultMemberPermissions: undefined,
    guilds: ["874802018361950248"],
  })
  perm5(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash("perm6", {
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    guilds: ["874802018361950248"],
  })
  perm6(interaction: ChatInputCommandInteraction): void {
    interaction.reply(":wave:");
  }
}
