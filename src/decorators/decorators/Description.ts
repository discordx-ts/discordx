import { MetadataStorage, Modifier } from "../..";
import { DSlash } from "../classes/DSlash";

export function Description(description: string);
export function Description(description: string) {
  return (
    target: Object,
    key: string,
    descriptor: PropertyDescriptor
  ): void => {
    MetadataStorage.instance.addModifier(
      Modifier.create<DSlash>(async (original) => {
        original.description = description;
      }, DSlash).decorate(target.constructor, key, descriptor.value)
    );
  };
}
