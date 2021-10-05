import {
  ClassMethodDecorator,
  DApplicationCommand,
  DComponentButton,
  DComponentSelectMenu,
  DDiscord,
  DSimpleCommand,
  IGuild,
  MetadataStorage,
  Modifier,
} from "../..";

/**
 * Define guild id for your application command, simple command, events, select menu, button
 * @param guildID guild id
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/guild)
 * @category Decorator
 */
export function Guild(guildID: IGuild): ClassMethodDecorator;

/**
 * Define guild id for your application command, simple command, events, select menu, button
 * @param guildIDs array of guild id's
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/guild)
 * @category Decorator
 */
export function Guild(...guildIDs: IGuild[]): ClassMethodDecorator;

export function Guild(...guildIDs: IGuild[]): ClassMethodDecorator {
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
          original.guilds = [...original.guilds, ...guildIDs];

          if (original instanceof DDiscord) {
            [
              ...original.applicationCommands,
              ...original.simpleCommands,
              ...original.buttons,
              ...original.selectMenus,
            ].forEach((obj) => {
              obj.guilds = [...obj.guilds, ...guildIDs];
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
