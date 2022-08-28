import type { MethodDecoratorEx } from "@discordx/internal";
import { ApplicationCommandType } from "discord.js";

import type { ApplicationCommandOptions, VerifyName } from "../../index.js";
import {
  DApplicationCommand,
  MetadataStorage,
  SlashNameValidator,
} from "../../index.js";

/**
 * Handle a slash command with a defined name
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/packages/discordx/guides/decorators/command/slash)
 *
 * @category Decorator
 */
export function Slash(): MethodDecoratorEx;

/**
 * Handle a slash command with a defined name
 *
 * @param options - Application command options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/packages/discordx/guides/decorators/command/slash)
 *
 * @category Decorator
 */
export function Slash<T extends string>(
  options: ApplicationCommandOptions<VerifyName<T>>
): MethodDecoratorEx;

/**
 * Handle a slash command with a defined name
 *
 * @param options - Application command options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/packages/discordx/guides/decorators/command/slash)
 *
 * @category Decorator
 */
export function Slash(options?: ApplicationCommandOptions): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    const name = options?.name ?? key;
    SlashNameValidator(name);

    const applicationCommand = DApplicationCommand.create({
      botIds: options?.botIds,
      defaultMemberPermissions: options?.defaultMemberPermissions,
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
