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
      Modifier.create<DSlash | DDiscord>(
        async (original) => {
          original.guilds = [
            ...original.guilds,
            ...guildIDs.filter((guildID) => !original.guilds.includes(guildID)),
          ];

          if (original instanceof DDiscord) {
            original.slashes.forEach((slash) => {
              slash.guilds = [
                ...slash.guilds,
                ...guildIDs.filter(
                  (guildID) => !slash.guilds.includes(guildID)
                ),
              ];
            });
          }
        },
        DSlash,
        DDiscord
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
