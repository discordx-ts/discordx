import type {
  ClassDecoratorEx,
  ClassMethodDecorator,
} from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type {
  DApplicationCommandOption,
  SlashGroupParams,
} from "../../index.js";
import {
  DApplicationCommand,
  DApplicationCommandGroup,
  DDiscord,
  MetadataStorage,
} from "../../index.js";

/**
 * Group your slash command
 *
 * [View Discord.ts Documentation](https://discord-ts.js.org/docs/decorators/commands/slashgroup)
 *
 * [View Discord Documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 * @category Decorator
 */
export function SlashGroup(
  info: Omit<SlashGroupParams, "applyToChild">
): ClassMethodDecorator;
export function SlashGroup(info: SlashGroupParams): ClassDecoratorEx;

export function SlashGroup(info: SlashGroupParams): ClassMethodDecorator {
  return function <T>(
    target: T,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    const myClass = target as unknown as new () => unknown;

    if (descriptor || info.appendToChild) {
      // If @SlashGroup decorate a method edit the method and add it to subgroup
      MetadataStorage.instance.addModifier(
        Modifier.create<DApplicationCommand | DDiscord>(
          (original) => {
            if (original instanceof DDiscord) {
              [...original.applicationCommands].forEach((obj) => {
                obj.group = info.root ?? info.name;
                obj.subgroup = info.root ? info.name : undefined;
              });
            } else {
              original.group = info.root ?? info.name;
              original.subgroup = info.root ? info.name : undefined;
            }
          },
          DApplicationCommand,
          DDiscord
        ).decorateUnknown(target, key, descriptor)
      );
    }

    if (!descriptor) {
      if (info.root) {
        MetadataStorage.instance.addApplicationCommandSlashSubGroups(
          DApplicationCommandGroup.create<DApplicationCommandOption>(
            info.name,
            {
              description: info.description,
            }
          ).decorate(myClass, myClass.name)
        );
      } else {
        MetadataStorage.instance.addApplicationCommandSlashGroups(
          DApplicationCommandGroup.create<DApplicationCommand>(info.name, {
            description: info.description,
          }).decorate(myClass, key ?? myClass.name)
        );
      }
    }
  };
}
