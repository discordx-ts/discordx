import { MetadataStorage, DSlash, Modifier, DDiscord } from "../..";
import { DCommand } from "../classes/DCommand";

export function Name(name: string);
export function Name(name: string) {
  return (
    target: Function,
    key?: string,
    descriptor?: PropertyDescriptor
  ): void => {
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
