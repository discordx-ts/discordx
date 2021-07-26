import { MetadataStorage, DSlash, SlashParams } from "../..";
import { MethodDecoratorEx } from "../../types/public/decorators";

export function Slash(name?: string): MethodDecoratorEx;
export function Slash(name?: string, params?: SlashParams): MethodDecoratorEx;
export function Slash(name?: string, params?: SlashParams) {
  return function (target: Record<string, any>, key: string) {
    name = name ?? key;
    name = name.toLocaleLowerCase();

    const slash = DSlash.create(
      name,
      params?.description,
      params?.defaultPermission,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addSlash(slash);
  };
}
