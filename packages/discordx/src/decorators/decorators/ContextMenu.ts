import type { MethodDecoratorEx } from "@discordx/internal";
import type { ApplicationCommandType } from "discord.js";

import type { ApplicationCommandOptions } from "../../index.js";
import { DApplicationCommand, MetadataStorage } from "../../index.js";

/**
 * Interact with context menu with a defined identifier
 *
 * @param type Context menu type
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/contextmenu)
 *
 * @category Decorator
 */
export function ContextMenu(
  type: Exclude<ApplicationCommandType, "CHAT_INPUT">
): MethodDecoratorEx;

/**
 * Interact with context menu with a defined identifier
 *
 * @param type Context menu type
 * @param name Context menu name
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/contextmenu)
 *
 * @category Decorator
 */
export function ContextMenu(
  type: Exclude<ApplicationCommandType, "CHAT_INPUT">,
  name?: string
): MethodDecoratorEx;

/**
 * Interact with context menu with a defined identifier
 *
 * @param type Context menu type
 * @param name Context menu name
 * @param options Options for the context menu
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/contextmenu)
 *
 * @category Decorator
 */
export function ContextMenu(
  type: Exclude<ApplicationCommandType, "CHAT_INPUT">,
  name?: string,
  options?: Omit<ApplicationCommandOptions, "description">
): MethodDecoratorEx;

export function ContextMenu(
  type: Exclude<ApplicationCommandType, "CHAT_INPUT">,
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

    if (type == "MESSAGE") {
      MetadataStorage.instance.addApplicationCommandMessage(applicationCommand);
    } else {
      MetadataStorage.instance.addApplicationCommandUser(applicationCommand);
    }
  };
}
