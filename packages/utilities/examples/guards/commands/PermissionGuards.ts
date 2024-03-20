/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { PermissionHandler } from "@discordx/utilities";
import { PermissionGuard } from "@discordx/utilities";
import type { PermissionsString } from "discord.js";
import { CommandInteraction } from "discord.js";
import { Discord, Guard, Slash } from "discordx";

@Discord()
export class PermissionGuards {
  /**
   * Only allow users with the role "BAN_MEMBERS"
   *
   * @param interaction
   */
  @Slash({
    description: "permission_ban_members_1",
    name: "permission_ban_members_1",
  })
  @Guard(PermissionGuard(["BanMembers"]))
  banMembers1(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * Only allow users with the role "BAN_MEMBERS" with a custom message
   *
   * @param interaction
   */
  @Slash({
    description: "permission_ban_members_2",
    name: "permission_ban_members_2",
  })
  @Guard(
    PermissionGuard(["BanMembers"], {
      content: "You do not have the role `BanMembers`",
      ephemeral: true,
    }),
  )
  banMembers2(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * get the permissions from an async resolver
   *
   * @param interaction
   */
  @Slash({
    description: "permission_ban_members_3",
    name: "permission_ban_members_3",
  })
  @Guard(
    PermissionGuard(PermissionGuards.resolvePermission, {
      content: "You do not have the role `BanMembers`",
      ephemeral: true,
    }),
  )
  banMembers3(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  private static resolvePermission(
    this: void,
    interaction: PermissionHandler,
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
