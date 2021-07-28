import { MetadataStorage, Modifier } from "../..";
import { ClassMethodDecorator } from "../../types/public/decorators";
import { DButton } from "../classes/DButton";
import { DCommand } from "../classes/DCommand";
import { DDiscord } from "../classes/DDiscord";
import { DOn } from "../classes/DOn";
import { DSelectMenu } from "../classes/DSelectMenu";
import { DSlash } from "../classes/DSlash";

export function Bot(botID: string): ClassMethodDecorator;
export function Bot(...botIDs: string[]): ClassMethodDecorator;
export function Bot(...botIDs: string[]): ClassMethodDecorator {
  return function (
    target: Record<string, any>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<
        DSlash | DCommand | DDiscord | DButton | DSelectMenu | DOn
      >(
        (original) => {
          original.botIds = [
            ...original.botIds,
            ...botIDs.filter((botID) => !original.botIds.includes(botID)),
          ];

          if (original instanceof DDiscord) {
            [
              ...original.slashes,
              ...original.commands,
              ...original.buttons,
              ...original.selectMenus,
              ...original.events,
            ].forEach((ob) => {
              ob.botIds = [
                ...ob.botIds,
                ...botIDs.filter((botID) => !ob.botIds.includes(botID)),
              ];
            });
          }
        },
        DSlash,
        DCommand,
        DDiscord,
        DButton,
        DSelectMenu,
        DOn
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
