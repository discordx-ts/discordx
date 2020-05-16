import {
  MetadataStorage,
  DCommand,
  Modifier,
  DDiscord,
  TypeOrPromise
} from "..";

export function Description(description: string);
export function Description(description: (command: DCommand) => TypeOrPromise<string>);
export function Description(description: string | ((command: DCommand) => TypeOrPromise<string>)) {
  const normalizedDescription = typeof description === "string" ? () => description : description;

  return (target: Function, key?: string, descriptor?: PropertyDescriptor): void => {
    MetadataStorage.instance.addModifier(
      Modifier
      .createModifier<DCommand | DDiscord>(
        async (original) => {
          original.infos.description = await normalizedDescription(original as any);
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
