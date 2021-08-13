import {
  MetadataStorage,
  DApplicationCommand,
  ApplicationCommandParams,
} from "../..";
import { MethodDecoratorEx } from "../../types/public/decorators";

export function Slash(name?: string): MethodDecoratorEx;
export function Slash(
  name?: string,
  params?: ApplicationCommandParams
): MethodDecoratorEx;
export function Slash(name?: string, params?: ApplicationCommandParams) {
  return function (target: Record<string, any>, key: string) {
    name = name ?? key;
    name = name.toLocaleLowerCase();

    const applicationCommand = DApplicationCommand.create(
      name,
      "CHAT_INPUT",
      params?.description,
      params?.defaultPermission,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addApplicationCommand(applicationCommand);
  };
}
