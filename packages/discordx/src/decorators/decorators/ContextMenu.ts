import type { MethodDecoratorEx } from "@discordx/internal";
import { ApplicationCommandType } from "discord.js";

import type { ApplicationCommandOptions } from "../../index.js";
import { DApplicationCommand, MetadataStorage } from "../../index.js";
import type { NotEmpty } from "../../types/index.js";

/**
 * Interact with context menu with a defined identifier
 *
 * @param options - Application command options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/gui/context-menu)
 *
 * @category Decorator
 */
export function ContextMenu<TName extends string>(
  options: Omit<
    ApplicationCommandOptions<NotEmpty<TName>> & {
      type: Exclude<ApplicationCommandType, ApplicationCommandType.ChatInput>;
    },
    "description" | "descriptionLocalizations"
  >
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    const applicationCommand = DApplicationCommand.create({
      botIds: options.botIds,
      defaultMemberPermissions: options.defaultMemberPermissions,
      dmPermission: options.dmPermission,
      guilds: options.guilds,
      name: options.name ?? key,
      nameLocalizations: options.nameLocalizations,
      type: options.type,
    }).decorate(target.constructor, key, target[key]);

    if (options.type === ApplicationCommandType.Message) {
      MetadataStorage.instance.addApplicationCommandMessage(applicationCommand);
    } else {
      MetadataStorage.instance.addApplicationCommandUser(applicationCommand);
    }
  };
}
