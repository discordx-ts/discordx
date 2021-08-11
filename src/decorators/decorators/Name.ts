import { MetadataStorage, DApplicationCommand, Modifier, DDiscord } from "../..";
import { DSimpleCommand } from "../classes/DSimpleCommand";

export function Name(name: string) {
  return function (
    target: Record<string, any>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DApplicationCommand | DSimpleCommand | DDiscord>(
        (original) => {
          original.name = name;
        },
        DApplicationCommand,
        DSimpleCommand,
        DDiscord
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
