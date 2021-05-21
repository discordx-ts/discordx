import { MetadataStorage, Modifier } from "../..";
import { DDiscord } from "../classes/DDiscord";
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
      Modifier.create<DSlash | DDiscord>(async (original) => {
        original.guilds = [
          ...original.guilds,
          ...guildIDs
        ];

        if (original instanceof DDiscord) {
          original.slashes.map((slash) => {
            slash.guilds = [
              ...slash.guilds,
              ...guildIDs
            ];
          });
        }
      }, DSlash, DDiscord).decorateUnknown(target, key, descriptor)
    );
  };
}
