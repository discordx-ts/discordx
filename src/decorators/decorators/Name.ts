import { MetadataStorage, DCommand, Modifier, DDiscord } from "../..";

export function Name(name: string);
export function Name(name: string) {
  return (
    target: Function,
    key?: string,
    descriptor?: PropertyDescriptor
  ): void => {
    MetadataStorage.instance.addModifier(
      Modifier.createModifier<DCommand | DDiscord>(async (original) => {
        original.infos = {
          ...original.infos,
          name,
        };
      }).decorateUnknown(target, key, descriptor)
    );
  };
}
