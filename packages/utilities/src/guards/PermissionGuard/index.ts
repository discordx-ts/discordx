import type {
  CommandInteraction,
  Guild,
  MessageOptions,
  PermissionString,
} from "discord.js";
import { GuildMember } from "discord.js";
import type { Client, GuardFunction, Next } from "discordx";
import { SimpleCommandMessage } from "discordx";

export type PermissionHandler = CommandInteraction | SimpleCommandMessage;

export type PermissionsType =
  | PermissionString[]
  | ((interaction: PermissionHandler) => Promise<PermissionString[]>);

export type PermissionOptions = MessageOptions & {
  ephemeral?: boolean;
};

/**
 * This is useful for global commands that cannot use the `@Permission` decorator until Permissions 2v is released.
 *
 * @param permissions - Permissions array or a function that resolves permissions
 * @param options - options
 */
export function PermissionGuard(
  permissions: PermissionsType,
  options?: PermissionOptions
): GuardFunction<PermissionHandler> {
  // reply or followup, if used on interactions
  async function replyOrFollowUp(
    interaction: CommandInteraction,
    replyOptions: PermissionOptions
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
    perms: PermissionString[]
  ): Promise<void> {
    const finalResponse = options ?? {
      content: `you need \`\`${perms.join(
        ", "
      )}\`\` permissions for this command`,
    };

    if (arg instanceof SimpleCommandMessage) {
      await arg?.message.reply(finalResponse);
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
      if (arg.inGuild() && arg.isCommand()) {
        guild = arg.guild;
        if (arg.member instanceof GuildMember) {
          callee = arg.member;
        }
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
