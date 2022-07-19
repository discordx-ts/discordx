import type { MethodDecoratorEx } from "@discordx/internal";
import { ApplicationCommandType } from "discord.js";

import type { ApplicationCommandOptions, VerifyName } from "../../index.js";
import { DApplicationCommand, MetadataStorage } from "../../index.js";

/**
 * Handle a slash command with a defined name
 *
 * @param name - Slash name
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/slash)
 *
 * @category Decorator -
 */
export function Slash<T extends string>(
  name?: VerifyName<T>
): MethodDecoratorEx;

/**
 * Handle a slash command with a defined name
 *
 * @param name - Slash name
 * @param options - Slash options
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/slash)
 *
 * @category Decorator
 */
export function Slash<T extends string>(
  name?: VerifyName<T>,
  options?: ApplicationCommandOptions
): MethodDecoratorEx;

export function Slash(
  name?: string,
  options?: ApplicationCommandOptions
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    name = name ?? key;

    const applicationCommand = DApplicationCommand.create({
      botIds: options?.botIds,
      defaultMemberPermissions: options?.defaultMemberPermissions,
      defaultPermission: options?.defaultPermission,
      description: options?.description,
      descriptionLocalizations: options?.descriptionLocalizations,
      dmPermission: options?.dmPermission,
      guilds: options?.guilds,
      name: name,
      nameLocalizations: options?.nameLocalizations,
      type: ApplicationCommandType.ChatInput,
    }).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addApplicationCommandSlash(applicationCommand);
  };
}
