import { MetadataStorage, DSlash, SlashParams } from "../..";

export function Slash();
export function Slash(name: string);
export function Slash(name: string, params: SlashParams);
export function Slash(name?: string, params?: SlashParams) {
  return async (
    target: Object,
    key: string,
    descriptor: PropertyDescriptor
  ) => {
    name = name || key;
    name = name.toLocaleLowerCase();

    const slash = DSlash.create(name, params?.description, params?.defaultPermission, params?.guilds).decorate(
      target.constructor,
      key,
      target[key]
    );

    MetadataStorage.instance.addSlash(slash);
  };
}
