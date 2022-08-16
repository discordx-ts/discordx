import type { MethodDecoratorEx } from "@discordx/internal";
import { ApplicationCommandType } from "discord.js";

import type { ApplicationCommandOptions, VerifyName } from "../../index.js";
import { DApplicationCommand, MetadataStorage } from "../../index.js";

/**
 * Handle a slash command with a defined name
 *
 * @param options - Slash options
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/slash)
 *
 * @category Decorator
 */
export function Slash<T extends string>(
  options?: ApplicationCommandOptions<VerifyName<T>>
): MethodDecoratorEx;

export function Slash(options?: ApplicationCommandOptions): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    const applicationCommand = DApplicationCommand.create({
      botIds: options?.botIds,
      defaultMemberPermissions: options?.defaultMemberPermissions,
      description: options?.description,
      descriptionLocalizations: options?.descriptionLocalizations,
      dmPermission: options?.dmPermission,
      guilds: options?.guilds,
      name: options?.name ?? key,
      nameLocalizations: options?.nameLocalizations,
      type: ApplicationCommandType.ChatInput,
    }).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addApplicationCommandSlash(applicationCommand);
  };
}
