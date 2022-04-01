import type { MethodDecoratorEx } from "@discordx/internal";
import { ApplicationCommandType } from "discord.js";

import type { ApplicationCommandOptions } from "../../index.js";
import { DApplicationCommand, MetadataStorage } from "../../index.js";
import type { NotEmpty } from "../../types/index.js";

/**
 * Interact with context menu with a defined identifier
 *
 * @param type - Context menu type
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/context-menu)
 *
 * @category Decorator
 */
export function ContextMenu(
  type: Exclude<ApplicationCommandType, ApplicationCommandType.ChatInput>
): MethodDecoratorEx;

/**
 * Interact with context menu with a defined identifier
 *
 * @param type - Context menu type
 * @param name - Context menu name
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/context-menu)
 *
 * @category Decorator
 */
export function ContextMenu<T extends string>(
  type: Exclude<ApplicationCommandType, ApplicationCommandType.ChatInput>,
  name: NotEmpty<T>
): MethodDecoratorEx;

/**
 * Interact with context menu with a defined identifier
 *
 * @param type - Context menu type
 * @param name - Context menu name
 * @param options - Options for the context menu
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/context-menu)
 *
 * @category Decorator
 */
export function ContextMenu<T extends string>(
  type: Exclude<ApplicationCommandType, ApplicationCommandType.ChatInput>,
  name: NotEmpty<T>,
  options: Omit<ApplicationCommandOptions, "description">
): MethodDecoratorEx;

export function ContextMenu(
  type: Exclude<ApplicationCommandType, ApplicationCommandType.ChatInput>,
  name?: string,
  options?: Omit<ApplicationCommandOptions, "description">
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    name = name ?? key;

    const applicationCommand = DApplicationCommand.create(
      name,
      type,
      undefined,
      options?.defaultPermission,
      options?.guilds,
      options?.botIds
    ).decorate(target.constructor, key, target[key]);

    if (type == ApplicationCommandType.Message) {
      MetadataStorage.instance.addApplicationCommandMessage(applicationCommand);
    } else {
      MetadataStorage.instance.addApplicationCommandUser(applicationCommand);
    }
  };
}
