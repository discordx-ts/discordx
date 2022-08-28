import type { ClassMethodDecorator } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type { NotEmpty } from "../../index.js";
import {
  DApplicationCommand,
  DComponent,
  DDiscord,
  DOn,
  DReaction,
  DSimpleCommand,
  MetadataStorage,
} from "../../index.js";

/**
 * Execute your application button, event, select menu, simple command, slash by defined bot
 * when multiple bots are running simultaneously
 *
 * @param botId - Bot identifier
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/bot)
 *
 * @category Decorator
 */
export function Bot<T extends string>(botId: NotEmpty<T>): ClassMethodDecorator;

/**
 * Execute your application button, event, select menu, simple command, slash by defined bot
 * when multiple bots are running simultaneously
 *
 * @param botIds - Multiple bot identifiers
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/bot)
 *
 * @category Decorator
 */
export function Bot(...botIds: string[]): ClassMethodDecorator;

/**
 * Execute your application button, event, select menu, simple command, slash by defined bot
 * when multiple bots are running simultaneously
 *
 * @param botIds - Multiple bot identifiers
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/bot)
 *
 * @category Decorator
 */
export function Bot(...botIds: string[]): ClassMethodDecorator {
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
        | DComponent
        | DOn
        | DReaction
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
        DOn,
        DReaction
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
