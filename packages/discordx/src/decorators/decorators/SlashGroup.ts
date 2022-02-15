import type {
  ClassDecoratorEx,
  ClassMethodDecorator,
} from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type {
  DApplicationCommandOption,
  SlashGroupOptions,
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
 * @param options Group options
 * ___
 *
 * [View Discord.ts Documentation](https://discord-ts.js.org/docs/decorators/commands/slashgroup)
 *
 * [View Discord Documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 *
 * @category Decorator
 */
export function SlashGroup(
  options: Omit<SlashGroupOptions, "appendToChild">
): ClassMethodDecorator;
export function SlashGroup(options: SlashGroupOptions): ClassDecoratorEx;

export function SlashGroup(options: SlashGroupOptions): ClassMethodDecorator {
  return function <T>(
    target: T,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    if (descriptor || options.appendToChild) {
      // If @SlashGroup decorate a method edit the method and add it to subgroup
      MetadataStorage.instance.addModifier(
        Modifier.create<DApplicationCommand | DDiscord>(
          (original) => {
            if (original instanceof DDiscord) {
              [...original.applicationCommands].forEach((obj) => {
                obj.group = options.root ?? options.name;
                obj.subgroup = options.root ? options.name : undefined;
              });
            } else {
              original.group = options.root ?? options.name;
              original.subgroup = options.root ? options.name : undefined;
            }
          },
          DApplicationCommand,
          DDiscord
        ).decorateUnknown(target, key, descriptor)
      );
    } else {
      const myClass = target as unknown as new () => unknown;
      if (options.root) {
        MetadataStorage.instance.addApplicationCommandSlashSubGroups(
          DApplicationCommandGroup.create<DApplicationCommandOption>(
            options.name,
            { description: options.description }
          ).decorate(myClass, myClass.name)
        );
      } else {
        MetadataStorage.instance.addApplicationCommandSlashGroups(
          DApplicationCommandGroup.create<DApplicationCommand>(options.name, {
            description: options.description,
          }).decorate(myClass, key ?? myClass.name)
        );
      }
    }
  };
}
