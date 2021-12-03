import {
  ApplicationCommandParams,
  DApplicationCommand,
  MetadataStorage,
  MethodDecoratorEx,
} from "../../index.js";
import { ApplicationCommandType } from "discord.js";

/**
 * define context menu for your bot
 * @param type USER | MESSAGE
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/contextmenu)
 * @category Decorator
 */
export function ContextMenu(
  type: Exclude<ApplicationCommandType, "CHAT_INPUT">
): MethodDecoratorEx;

/**
 * define context menu for your bot
 * @param type USER | MESSAGE
 * @param name name of your context menu
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/contextmenu)
 * @category Decorator
 */
export function ContextMenu(
  type: Exclude<ApplicationCommandType, "CHAT_INPUT">,
  name?: string
): MethodDecoratorEx;

/**
 * define context menu for your bot
 * @param type USER | MESSAGE
 * @param name name of your context menu
 * @param params additional configuration
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/contextmenu)
 * @category Decorator
 */
export function ContextMenu(
  type: Exclude<ApplicationCommandType, "CHAT_INPUT">,
  name?: string,
  params?: ApplicationCommandParams
): MethodDecoratorEx;

export function ContextMenu(
  type: Exclude<ApplicationCommandType, "CHAT_INPUT">,
  name?: string,
  params?: ApplicationCommandParams
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    name = name ?? key;

    const applicationCommand = DApplicationCommand.create(
      name,
      type,
      params?.description,
      params?.defaultPermission,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);

    if (type == "MESSAGE") {
      MetadataStorage.instance.addApplicationCommandMessage(applicationCommand);
    } else {
      MetadataStorage.instance.addApplicationCommandUser(applicationCommand);
    }
  };
}
