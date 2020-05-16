import {
  MetadataStorage,
  DCommand,
  Modifier,
  DDiscord
} from "../..";

export function Description(description: string);
export function Description(description: string) {
  return (target: Function, key?: string, descriptor?: PropertyDescriptor): void => {
    MetadataStorage.instance.addModifier(
      Modifier
      .createModifier<DCommand | DDiscord>(
        async (original) => {
          original.infos = {
            ...original.infos,
            description
          };
        }
      )
      .decorateUnknown(
        target,
        key,
        descriptor
      )
    );
  };
}
