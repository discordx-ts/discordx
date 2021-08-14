import { MetadataStorage, Modifier } from "../..";
import { ClassMethodDecorator } from "../../types/public/decorators";
import { DComponentButton } from "../classes/DComponentButton";
import { DSimpleCommand } from "../classes/DSimpleCommand";
import { DDiscord } from "../classes/DDiscord";
import { DOn } from "../classes/DOn";
import { DComponentSelectMenu } from "../classes/DComponentSelectMenu";
import { DApplicationCommand } from "../classes/DApplicationCommand";

/**
 * Execute your application command, button, select menu, simple command or event by defined bot when multiple bots are running in the same instance
 * @param botID id of your bot
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/bot)
 */
export function Bot(botID: string): ClassMethodDecorator;

/**
 * Make your application command, button, select menu, simple command or event executable by defined bot in case of multiple bot are running in same instance
 * @param botIDs array of bot id's
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/bot)
 */
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
        | DComponentButton
        | DComponentSelectMenu
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
        DComponentButton,
        DComponentSelectMenu,
        DOn
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
