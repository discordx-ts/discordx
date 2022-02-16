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
 * Create slash group
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
export function SlashGroup(options: SlashGroupOptions): ClassDecoratorEx;

/**
 * Assign a group to a method or class
 *
 * @param name Name of group
 * ___
 *
 * [View Discord.ts Documentation](https://discord-ts.js.org/docs/decorators/commands/slashgroup)
 *
 * [View Discord Documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 *
 * @category Decorator
 */
export function SlashGroup(name: string): ClassMethodDecorator;

/**
 * Assign a group to a method or class
 *
 * @param name Name of group
 * @param root Root name of group
 * ___
 *
 * [View Discord.ts Documentation](https://discord-ts.js.org/docs/decorators/commands/slashgroup)
 *
 * [View Discord Documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 *
 * @category Decorator
 */
export function SlashGroup(name: string, root: string): ClassMethodDecorator;

export function SlashGroup(
  options: SlashGroupOptions | string,
  root?: string
): ClassMethodDecorator {
  return function <T>(
    target: T,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    if (typeof options === "string") {
      // If @SlashGroup decorate a method edit the method and add it to subgroup
      MetadataStorage.instance.addModifier(
        Modifier.create<DApplicationCommand | DDiscord>(
          (original) => {
            if (original instanceof DDiscord) {
              [...original.applicationCommands].forEach((obj) => {
                obj.group = root ?? options;
                obj.subgroup = root ? options : undefined;
              });
            } else {
              original.group = root ?? options;
              original.subgroup = root ? options : undefined;
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
