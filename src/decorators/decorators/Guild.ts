import { Snowflake } from "discord.js";
import { MetadataStorage, Modifier } from "../..";
import { ClassMethodDecorator } from "../../types/public/decorators";
import { DButton } from "../classes/DButton";
import { DCommand } from "../classes/DCommand";
import { DDiscord } from "../classes/DDiscord";
import { DSelectMenu } from "../classes/DSelectMenu";
import { DSlash } from "../classes/DSlash";

export function Guild(guildID: Snowflake): ClassMethodDecorator;
export function Guild(...guildIDs: Snowflake[]): ClassMethodDecorator;
export function Guild(...guildIDs: Snowflake[]) {
  return function (
    target: Record<string, any>,
    key: string,
    descriptor: PropertyDescriptor
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DSlash | DCommand | DDiscord | DButton | DSelectMenu>(
        (original) => {
          original.guilds = [
            ...original.guilds,
            ...guildIDs.filter((guildID) => !original.guilds.includes(guildID)),
          ];

          if (original instanceof DDiscord) {
            [
              ...original.slashes,
              ...original.commands,
              ...original.buttons,
              ...original.selectMenus,
            ].forEach((slash) => {
              slash.guilds = [
                ...slash.guilds,
                ...guildIDs.filter(
                  (guildID) => !slash.guilds.includes(guildID)
                ),
              ];
            });
          }
        },
        DSlash,
        DCommand,
        DDiscord,
        DButton,
        DSelectMenu
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
