import type { PermissionString } from "discord.js";
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Guard, Slash } from "discordx";

import type { PermissionHandlerInteraction } from "../../../src/index.js";
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

  private static resolvePermission(
    interaction: PermissionHandlerInteraction
  ): Promise<PermissionString[]> {
    if (interaction instanceof CommandInteraction) {
      // if guild id is 123
      if (interaction.guildId === "123") {
        return Promise.resolve(["ADD_REACTIONS"]);
      }
    }
    return Promise.resolve(["BAN_MEMBERS"]);
  }

  /**
   * Only allow users with the role "BAN_MEMBERS" with a custom embed
   *
   * @param interaction
   */

  
  @Slash("permission_ban_members")
  @Guard(
    PermissionGuard(["BAN_MEMBERS"], PermissionGuards.genEmbed())
  )
  banMembers4(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  private static genEmbed() {
    let embed = new MessageEmbed()
    .setColor("RED")
    .setDescription("You do not have the role `BAN_MEMBERS`");
    return embed;
  }
}
