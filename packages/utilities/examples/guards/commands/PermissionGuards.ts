import type { PermissionsString } from "discord.js";
import { CommandInteraction } from "discord.js";
import { Discord, Guard, Slash } from "discordx";

import type { PermissionHandler } from "../../../src/index.js";
import { PermissionGuard } from "../../../src/index.js";

@Discord()
export class PermissionGuards {
  /**
   * Only allow users with the role "BAN_MEMBERS"
   *
   * @param interaction
   */
  @Slash({ name: "permission_ban_members" })
  @Guard(PermissionGuard(["BanMembers"]))
  banMembers1(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * Only allow users with the role "BAN_MEMBERS" with a custom message
   *
   * @param interaction
   */
  @Slash({ name: "permission_ban_members" })
  @Guard(
    PermissionGuard(["BanMembers"], {
      content: "You do not have the role `BanMembers`",
      ephemeral: true,
    })
  )
  banMembers2(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * get the permissions from an async resolver
   *
   * @param interaction
   */
  @Slash({ name: "permission_ban_members" })
  @Guard(
    PermissionGuard(PermissionGuards.resolvePermission, {
      content: "You do not have the role `BanMembers`",
      ephemeral: true,
    })
  )
  banMembers3(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  private static resolvePermission(
    this: void,
    interaction: PermissionHandler
  ): Promise<PermissionsString[]> {
    if (interaction instanceof CommandInteraction) {
      // if guild id is 123
      if (interaction.guildId === "123") {
        return Promise.resolve(["AddReactions"]);
      }
    }
    return Promise.resolve(["BanMembers"]);
  }
}
