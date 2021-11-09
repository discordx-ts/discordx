import {
  ClassMethodDecorator,
  DApplicationCommand,
  DComponentButton,
  DComponentSelectMenu,
  DDiscord,
  DOn,
  DSimpleCommand,
  MetadataStorage,
  Modifier,
} from "../../index.js";

/**
 * Execute your application command, button, select menu, simple command or event by defined bot when multiple bots are running in the same instance
 * @param botID id of your bot
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/bot)
 * @category Decorator
 */
export function Bot(botID: string): ClassMethodDecorator;

/**
 * Make your application command, button, select menu, simple command or event executable by defined bot in case of multiple bot are running in same instance
 * @param botIDs array of bot id's
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/bot)
 * @category Decorator
 */
export function Bot(...botIDs: string[]): ClassMethodDecorator;

export function Bot(...botIDs: string[]): ClassMethodDecorator {
  return function <T>(
    target: Record<string, T>,
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
