import { MetadataStorage, Modifier } from "../..";
import { DCommand } from "../classes/DCommand";
import { DSlash } from "../classes/DSlash";

export function Description(description: string);
export function Description(description: string) {
  return (
    target: Object,
    key: string,
    descriptor: PropertyDescriptor
  ): void => {
    MetadataStorage.instance.addModifier(
      Modifier.create<DSlash | DCommand>(
        (original) => {
          original.description = description;
        },
        DSlash,
        DCommand
      ).decorate(target.constructor, key, descriptor.value)
    );
  };
}
