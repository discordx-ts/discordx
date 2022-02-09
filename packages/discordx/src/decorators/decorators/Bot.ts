import type { ClassMethodDecorator } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type { NotEmpty } from "../../index.js";
import {
  DApplicationCommand,
  DComponent,
  DDiscord,
  DOn,
  DSimpleCommand,
  MetadataStorage,
} from "../../index.js";

/**
 * Execute your application command, button, select menu, simple command or event by defined bot when multiple bots are running in the same instance
 * @param botId id of your bot
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/bot)
 * @category Decorator
 */
export function Bot<T extends string>(botId: NotEmpty<T>): ClassMethodDecorator;

/**
 * Make your application command, button, select menu, simple command or event executable by defined bot in case of multiple bot are running in same instance
 * @param botIds array of bot id's
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/bot)
 * @category Decorator
 */
export function Bot(...botIds: string[]): ClassMethodDecorator;

export function Bot(...botIds: string[]): ClassMethodDecorator {
  return function <T>(
    target: Record<string, T>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<
        DApplicationCommand | DSimpleCommand | DDiscord | DComponent | DOn
      >(
        (original) => {
          original.botIds = [
            ...original.botIds,
            ...botIds.filter((botId) => !original.botIds.includes(botId)),
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
                ...botIds.filter((botId) => !ob.botIds.includes(botId)),
              ];
            });
          }
        },
        DApplicationCommand,
        DSimpleCommand,
        DDiscord,
        DComponent,
        DOn
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
