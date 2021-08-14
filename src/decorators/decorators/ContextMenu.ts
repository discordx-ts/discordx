import { ApplicationCommandType } from "discord.js";
import {
  MetadataStorage,
  DApplicationCommand,
  ApplicationCommandParams,
} from "../..";
import { MethodDecoratorEx } from "../../types/public/decorators";

/**
 * define context menu for your bot
 * @param type USER | MESSAGE
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/contextmenu)
 */
export function ContextMenu(
  type: Exclude<ApplicationCommandType, "CHAT_INPUT">
): MethodDecoratorEx;

/**
 * define context menu for your bot
 * @param type USER | MESSAGE
 * @param name name of your context menu
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/contextmenu)
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
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/contextmenu)
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
) {
  return function (target: Record<string, any>, key: string) {
    name = name ?? key;

    const applicationCommand = DApplicationCommand.create(
      name,
      type,
      params?.description,
      params?.defaultPermission,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addApplicationCommand(applicationCommand);
  };
}
