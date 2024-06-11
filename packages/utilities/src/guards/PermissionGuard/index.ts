/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type {
  BaseMessageOptions,
  CommandInteraction,
  Guild,
  PermissionsString,
} from "discord.js";
import { GuildMember } from "discord.js";
import type { Client, GuardFunction, Next } from "discordx";
import { SimpleCommandMessage } from "discordx";

export type PermissionHandler = CommandInteraction | SimpleCommandMessage;

export type PermissionsType =
  | PermissionsString[]
  | ((interaction: PermissionHandler) => Promise<PermissionsString[]>);

export type PermissionOptions = BaseMessageOptions & {
  ephemeral?: boolean;
};

/**
 * This is useful for global commands
 *
 * @param permissions - Permissions array or a function that resolves permissions
 * @param options - options
 */
export function PermissionGuard(
  permissions: PermissionsType,
  options?: PermissionOptions,
): GuardFunction<PermissionHandler> {
  // reply or followup, if used on interactions
  async function replyOrFollowUp(
    interaction: CommandInteraction,
    replyOptions: PermissionOptions,
  ): Promise<void> {
    // if interaction is already replied
    if (interaction.replied) {
      await interaction.followUp(replyOptions);
      return;
    }

    // if interaction is deferred but not replied
    if (interaction.deferred) {
      await interaction.editReply(replyOptions);
      return;
    }

    // if interaction is not handled yet
    await interaction.reply(replyOptions);

    return;
  }

  // send message
  async function post(
    arg: PermissionHandler,
    perms: PermissionsString[],
  ): Promise<void> {
    const finalResponse = options ?? {
      content: `you need \`\`${perms.join(
        ", ",
      )}\`\` permissions for this command`,
    };

    if (arg instanceof SimpleCommandMessage) {
      await arg.message.reply(finalResponse);
    } else {
      await replyOrFollowUp(arg, finalResponse);
    }

    return;
  }

  return async function (arg: PermissionHandler, client: Client, next: Next) {
    let guild: Guild | null = null;
    let callee: GuildMember | null = null;

    if (arg instanceof SimpleCommandMessage) {
      if (arg.message.inGuild()) {
        guild = arg.message.guild;
        callee = arg.message.member;
      }
    } else {
      guild = arg.guild;
      if (arg.member instanceof GuildMember) {
        callee = arg.member;
      }
    }

    // Don't bother if guilds or members aren't available, usually because of intents or DM
    if (!guild || !callee) {
      return next();
    }

    // resolve required permissions
    const perms =
      typeof permissions === "function" ? await permissions(arg) : permissions;

    // make sure member has listed permissions
    const isAllowed = callee.permissions.has(perms, true);
    if (isAllowed) {
      return next();
    }

    // handle unauthorized access
    return post(arg, perms);
  };
}
