import { MetadataStorage, Modifier, DDiscord } from "../..";
import { DSlash } from "../classes/DSlash";

export function Description(description: string);
export function Description(description: string) {
  return (
    target: Function,
    key?: string,
    descriptor?: PropertyDescriptor
  ): void => {
    MetadataStorage.instance.addModifier(
      Modifier.create<DSlash | DDiscord>(async (original) => {
        original.description = description;
      }, DSlash, DDiscord).decorateUnknown(target, key, descriptor)
    );
  };
}
