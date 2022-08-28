import type { ClassMethodDecorator } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type { IGuild } from "../../index.js";
import {
  DApplicationCommand,
  DComponent,
  DDiscord,
  DReaction,
  DSimpleCommand,
  MetadataStorage,
} from "../../index.js";

/**
 * Use buttons, events, select menus, simple commands and slashes for a defined guild only
 *
 * @param guildId - Guild identifier
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/guild)
 *
 * @category Decorator
 */
export function Guild(guildId: IGuild): ClassMethodDecorator;

/**
 * Use buttons, events, select menus, simple commands and slashes for a defined guild only
 *
 * @param guildIds - Guild identifiers
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/guild)
 *
 * @category Decorator
 */
export function Guild(...guildIds: IGuild[]): ClassMethodDecorator;

/**
 * Use buttons, events, select menus, simple commands and slashes for a defined guild only
 *
 * @param guildIds - Guild identifiers
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/guild)
 *
 * @category Decorator
 */
export function Guild(...guildIds: IGuild[]): ClassMethodDecorator {
  return function <T>(
    target: Record<string, T>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<
        DApplicationCommand | DSimpleCommand | DDiscord | DComponent | DReaction
      >(
        (original) => {
          original.guilds = [...original.guilds, ...guildIds];

          if (original instanceof DDiscord) {
            [
              ...original.applicationCommands,
              ...original.simpleCommands,
              ...original.buttons,
              ...original.selectMenus,
            ].forEach((obj) => {
              obj.guilds = [...obj.guilds, ...guildIds];
            });
          }
        },
        DApplicationCommand,
        DSimpleCommand,
        DDiscord,
        DComponent,
        DReaction
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
