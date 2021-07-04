import { MetadataStorage, Modifier } from "../..";
import { DButton } from "../classes/DButton";
import { DDiscord } from "../classes/DDiscord";
import { DOn } from "../classes/DOn";
import { DSelectMenu } from "../classes/DSelectMenu";
import { DSlash } from "../classes/DSlash";

export function Bot(botID: string);
export function Bot(...botIDs: string[]);
export function Bot(...botIDs: string[]) {
  return (
    target: Function,
    key: string,
    descriptor: PropertyDescriptor
  ): void => {
    MetadataStorage.instance.addModifier(
      Modifier.create<DSlash | DDiscord | DButton | DSelectMenu | DOn>(
        (original) => {
          original.botIds = [
            ...original.botIds,
            ...botIDs.filter((botID) => !original.botIds.includes(botID)),
          ];

          if (original instanceof DDiscord) {
            original.slashes.forEach((slash) => {
              slash.botIds = [
                ...slash.botIds,
                ...botIDs.filter((botID) => !slash.botIds.includes(botID)),
              ];
            });
          }
        },
        DSlash,
        DDiscord,
        DButton,
        DSelectMenu,
        DOn
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
