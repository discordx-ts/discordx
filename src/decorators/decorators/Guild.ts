import { ClassMethodDecorator, Modifier } from "@discordx/internal";
import {
  DApplicationCommand,
  DComponentButton,
  DComponentSelectMenu,
  DDiscord,
  DSimpleCommand,
  IGuild,
  MetadataStorage,
} from "../../index.js";

/**
 * Define guild id for your application command, simple command, events, select menu, button
 * @param guildId guild id
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/guild)
 * @category Decorator
 */
export function Guild(guildId: IGuild): ClassMethodDecorator;

/**
 * Define guild id for your application command, simple command, events, select menu, button
 * @param guildIds array of guild id's
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/guild)
 * @category Decorator
 */
export function Guild(...guildIds: IGuild[]): ClassMethodDecorator;

export function Guild(...guildIds: IGuild[]): ClassMethodDecorator {
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
        DComponentButton,
        DComponentSelectMenu
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
