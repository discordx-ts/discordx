import type { CommandInteraction } from "discord.js";
import { PermissionString } from "discord.js";
import { Discord, Guard, Slash } from "discordx";

import { PermissionGuard } from "../../../src/index.js";

@Discord()
export class PermissionGuards {
  /**
   * Only allow users with the role "BAN_MEMBERS"
   *
   * @param interaction
   */
  @Slash("permission_ban_members")
  @Guard(PermissionGuard(["BAN_MEMBERS"]))
  banMembers1(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * Only allow users with the role "BAN_MEMBERS" with a custom message
   *
   * @param interaction
   */
  @Slash("permission_ban_members")
  @Guard(
    PermissionGuard(["BAN_MEMBERS"], "You do not have the role `BAN_MEMBERS`")
  )
  banMembers2(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * get the permissions from an async resolver
   *
   * @param interaction
   */
  @Slash("permission_ban_members")
  @Guard(
    PermissionGuard(
      PermissionGuards.resolvePermission,
      "You do not have the role `BAN_MEMBERS`"
    )
  )
  banMembers3(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  private static resolvePermission(): Promise<PermissionString[]> {
    return Promise.resolve(["BAN_MEMBERS"]);
  }
}
