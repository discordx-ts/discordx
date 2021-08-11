import { MetadataStorage, DApplicationCommand, SlashParams } from "../..";
import { MethodDecoratorEx } from "../../types/public/decorators";

export function Slash(name?: string): MethodDecoratorEx;
export function Slash(name?: string, params?: SlashParams): MethodDecoratorEx;
export function Slash(name?: string, params?: SlashParams) {
  return function (target: Record<string, any>, key: string) {
    name = name ?? key;
    name = name.toLocaleLowerCase();

    const slash = DApplicationCommand.create(
      name,
      "CHAT_INPUT",
      params?.description,
      params?.defaultPermission,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addSlash(slash);
  };
}
