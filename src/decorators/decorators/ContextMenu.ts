import { ApplicationCommandType } from "discord.js";
import {
  MetadataStorage,
  DApplicationCommand,
  ApplicationCommandParams,
} from "../..";
import { MethodDecoratorEx } from "../../types/public/decorators";

export function ContextMenu(
  type: Exclude<ApplicationCommandType, "CHAT_INPUT">,
  name?: string
): MethodDecoratorEx;
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
