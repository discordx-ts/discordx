import {
  ClassMethodDecorator,
  DApplicationCommand,
  DComponentButton,
  DComponentSelectMenu,
  DDiscord,
  DSimpleCommand,
  MetadataStorage,
  Modifier,
} from "../..";
import { Snowflake } from "discord.js";

/**
 * Define guild id for your application command, simple command, events, select menu, button
 * @param guildID guild id
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/guild)
 * @category Decorator
 */
export function Guild(guildID: Snowflake): ClassMethodDecorator;

/**
 * Define guild id for your application command, simple command, events, select menu, button
 * @param guildIDs array of guild id's
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/guild)
 * @category Decorator
 */
export function Guild(...guildIDs: Snowflake[]): ClassMethodDecorator;

export function Guild(...guildIDs: Snowflake[]): ClassMethodDecorator {
  return function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      >(
        (original) => {
          original.guilds = [
            ...original.guilds,
            ...guildIDs.filter((guildID) => !original.guilds.includes(guildID)),
          ];

          if (original instanceof DDiscord) {
            [
              ...original.applicationCommands,
              ...original.simpleCommands,
              ...original.buttons,
              ...original.selectMenus,
            ].forEach((obj) => {
              obj.guilds = [
                ...obj.guilds,
                ...guildIDs.filter((guildID) => !obj.guilds.includes(guildID)),
              ];
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
