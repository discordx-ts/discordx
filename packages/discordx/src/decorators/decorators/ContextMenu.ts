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
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/context-menu)
 *
 * @category Decorator
 */
export function ContextMenu<T extends string>(
  options: Omit<
    ApplicationCommandOptions<NotEmpty<T>> & {
      type: Exclude<ApplicationCommandType, ApplicationCommandType.ChatInput>;
    },
    "description"
  >
): MethodDecoratorEx;

export function ContextMenu(
  options: Omit<
    ApplicationCommandOptions & {
      type: Exclude<ApplicationCommandType, ApplicationCommandType.ChatInput>;
    },
    "description"
  >
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    const applicationCommand = DApplicationCommand.create({
      botIds: options.botIds,
      guilds: options.guilds,
      name: options.name ?? key,
      type: options.type,
    }).decorate(target.constructor, key, target[key]);

    if (options.type === ApplicationCommandType.Message) {
      MetadataStorage.instance.addApplicationCommandMessage(applicationCommand);
    } else {
      MetadataStorage.instance.addApplicationCommandUser(applicationCommand);
    }
  };
}
