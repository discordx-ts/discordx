import { MetadataStorage, DSlash, Modifier, DDiscord } from "../..";
import { DCommand } from "../classes/DCommand";

export function Name(name: string) {
  return function (
    target: Record<string, any>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DSlash | DCommand | DDiscord>(
        (original) => {
          original.name = name;
        },
        DSlash,
        DCommand,
        DDiscord
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
