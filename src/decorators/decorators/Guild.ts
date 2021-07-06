import { MetadataStorage, Modifier } from "../..";
import { DButton } from "../classes/DButton";
import { DCommand } from "../classes/DCommand";
import { DDiscord } from "../classes/DDiscord";
import { DSelectMenu } from "../classes/DSelectMenu";
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
      Modifier.create<DSlash | DCommand | DDiscord | DButton | DSelectMenu>(
        (original) => {
          original.guilds = [
            ...original.guilds,
            ...guildIDs.filter((guildID) => !original.guilds.includes(guildID)),
          ];

          if (original instanceof DDiscord) {
            [
              ...original.slashes,
              ...original.commands,
              ...original.buttons,
              ...original.selectMenus,
            ].forEach((slash) => {
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
        DCommand,
        DDiscord,
        DButton,
        DSelectMenu
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
