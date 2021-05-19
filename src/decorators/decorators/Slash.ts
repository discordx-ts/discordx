import { MetadataStorage, DSlash } from "../..";

export function Slash();
export function Slash(command: string);
export function Slash(command?: string) {
  return async (
    target: Object,
    key: string,
    descriptor: PropertyDescriptor
  ) => {
    const finalCommand = command || key;

    const slash = DSlash.createSlash(finalCommand).decorate(
      target.constructor,
      key,
      target[key]
    );

    MetadataStorage.instance.addSlash(slash);
  };
}
