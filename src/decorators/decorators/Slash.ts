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

    const slash = DSlash.createSlash(
      name || key,
      params?.description,
    ).decorate(
      target.constructor,
      key,
      target[key]
    );

    MetadataStorage.instance.addSlash(slash);
  };
}
