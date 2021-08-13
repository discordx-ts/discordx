import { Snowflake } from "discord.js";
import { MetadataStorage, Modifier } from "../..";
import { ClassMethodDecorator } from "../../types/public/decorators";
import { DComponentButton } from "../classes/DComponentButton";
import { DSimpleCommand } from "../classes/DSimpleCommand";
import { DDiscord } from "../classes/DDiscord";
import { DComponentSelectMenu } from "../classes/DComponentSelectMenu";
import { DApplicationCommand } from "../classes/DApplicationCommand";

export function Guild(guildID: Snowflake): ClassMethodDecorator;
export function Guild(...guildIDs: Snowflake[]): ClassMethodDecorator;
export function Guild(...guildIDs: Snowflake[]): ClassMethodDecorator {
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
