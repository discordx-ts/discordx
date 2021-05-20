import { MetadataStorage, Modifier } from "../..";
import { DSlash } from "../classes/DSlash";

export function Guild(guildID: string);
export function Guild(...guildIDs: string[]);
export function Guild(...guildIDs: string[]) {
  return (
    target: Function,
    key: string,
    descriptor: PropertyDescriptor
  ): void => {
    MetadataStorage.instance.addModifier(
      Modifier.create<DSlash>(async (original) => {
        original.guilds = [
          ...original.guilds,
          ...guildIDs
        ];
      }, DSlash).decorate(target, key, descriptor.value)
    );
  };
}
