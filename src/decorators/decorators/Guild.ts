import { Snowflake } from "discord.js";
import { MetadataStorage, Modifier } from "../..";
import { ClassMethodDecorator } from "../../types/public/decorators";
import { DButtonComponent } from "../classes/DButtonComponent";
import { DSimpleCommand } from "../classes/DSimpleCommand";
import { DDiscord } from "../classes/DDiscord";
import { DSelectMenuComponent } from "../classes/DSelectMenuComponent";
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
      Modifier.create<DApplicationCommand | DSimpleCommand | DDiscord | DButtonComponent | DSelectMenuComponent>(
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
        DApplicationCommand,
        DSimpleCommand,
        DDiscord,
        DButtonComponent,
        DSelectMenuComponent
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
