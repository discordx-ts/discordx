import { MetadataStorage, Modifier } from "../..";
import { ClassMethodDecorator } from "../../types/public/decorators";
import { DButtonComponent } from "../classes/DButtonComponent";
import { DSimpleCommand } from "../classes/DSimpleCommand";
import { DDiscord } from "../classes/DDiscord";
import { DOn } from "../classes/DOn";
import { DSelectMenuComponent } from "../classes/DSelectMenuComponent";
import { DApplicationCommand } from "../classes/DApplicationCommand";

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
        | DApplicationCommand
        | DSimpleCommand
        | DDiscord
        | DButtonComponent
        | DSelectMenuComponent
        | DOn
      >(
        (original) => {
          original.botIds = [
            ...original.botIds,
            ...botIDs.filter((botID) => !original.botIds.includes(botID)),
          ];

          if (original instanceof DDiscord) {
            [
              ...original.applicationCommands,
              ...original.simpleCommands,
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
        DApplicationCommand,
        DSimpleCommand,
        DDiscord,
        DButtonComponent,
        DSelectMenuComponent,
        DOn
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
