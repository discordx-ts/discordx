import type {
  BaseCommandInteraction,
  CommandInteraction,
  ContextMenuInteraction,
  Guild,
  MessageComponentInteraction,
  PermissionString,
} from "discord.js";
import { GuildMember, MessageEmbed } from "discord.js";
import type { Client, GuardFunction, Next } from "discordx";
import { SimpleCommandMessage } from "discordx";

import type {
  PermissionGuardOptions,
  PermissionHandlerInteraction,
} from "./types";

/**
 * Set an array of permissions that this command is allowed to use, this is useful for global commands that can not use the `@Permission` decorator, until Permissions 2v is out
 * @param permissions - an array of Permissions or a function to resolve the permissions
 * @param options - Options for the guard reply. Available options are: `content` (string or MessageEmbed) and `ephemeral` (boolean) defaults to `content`: "No permissions" and `ephemeral`: false
 */
export function PermissionGuard(
  permissions:
    | PermissionString[]
    | ((
        interaction: PermissionHandlerInteraction
      ) => Promise<PermissionString[]>),
  options: PermissionGuardOptions = {
    content: "No permissions",
    ephemeral: false,
  }
): GuardFunction<
  CommandInteraction | SimpleCommandMessage | ContextMenuInteraction
> {
  type PermissionReplyOptions = {
    content?: string;
    embeds?: MessageEmbed[];
    ephemeral?: boolean;
  };

  async function replyOrFollowUp(
    interaction: BaseCommandInteraction | MessageComponentInteraction,
    content: PermissionReplyOptions
  ): Promise<void> {
    if (interaction.replied) {
      await interaction.followUp(content);
      return;
    }

    if (interaction.deferred) {
      await interaction.editReply(content);
      return;
    }

    await interaction.reply(content);
  }

  async function post(
    arg: BaseCommandInteraction | SimpleCommandMessage,
    msg: PermissionReplyOptions
  ): Promise<void> {
    if (arg instanceof SimpleCommandMessage) {
      await arg?.message.reply(msg);
    } else {
      return replyOrFollowUp(arg, msg);
    }
  }

  return async function (
    arg: CommandInteraction | SimpleCommandMessage | ContextMenuInteraction,
    client: Client,
    next: Next
  ) {
    let guild: Guild | null = null;
    let callee: GuildMember | null = null;
    if (!options.content) {
      options.content = "No permissions";
    }
    if (arg instanceof SimpleCommandMessage) {
      if (arg.message.inGuild()) {
        guild = arg.message.guild;
        callee = arg.message.member;
      }
    } else {
      if (arg.inGuild() && (arg.isContextMenu() || arg.isCommand())) {
        guild = arg.guild;
        if (arg.member instanceof GuildMember) {
          callee = arg.member;
        }
      }
    }
    if (!guild || !callee) {
      return next();
    }
    const perms =
      typeof permissions === "function" ? await permissions(arg) : permissions;

    const isAllowed = callee.permissions.has(perms, true);
    if (isAllowed) {
      return next();
    }

    const postOptions: PermissionReplyOptions = {
      ephemeral: !!options.ephemeral,
    };
    if (options.content instanceof MessageEmbed) {
      postOptions["embeds"] = [options.content];
    } else {
      postOptions["content"] = options.content;
    }
    return post(arg, postOptions);
  };
}
