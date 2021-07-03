import { MetadataStorage, DSlash, Modifier, DDiscord } from "../..";

export function Name(name: string);
export function Name(name: string) {
  return (
    target: Function,
    key?: string,
    descriptor?: PropertyDescriptor
  ): void => {
    MetadataStorage.instance.addModifier(
      Modifier.create<DSlash | DDiscord>(
        async (original) => {
          original.name = name;
        },
        DSlash,
        DDiscord
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
