import type { ClassMethodDecorator } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type {
  DApplicationCommandOption,
  SlashGroupParams,
} from "../../index.js";
import {
  DApplicationCommand,
  DApplicationCommandGroup,
  MetadataStorage,
} from "../../index.js";

/**
 * Group your slash command
 * @param subCommands object
 * ___
 * [View Discord.ts Documentation](https://discord-ts.js.org/docs/decorators/commands/slashgroup)
 *
 * [View Discord Documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 * @category Decorator
 */
export function SlashGroup(info: SlashGroupParams): ClassMethodDecorator;

export function SlashGroup(info: SlashGroupParams): ClassMethodDecorator {
  return function <T>(
    target: T,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    const myClass = target as unknown as new () => unknown;

    if (descriptor) {
      // If @SlashGroup decorate a method edit the method and add it to subgroup
      MetadataStorage.instance.addModifier(
        Modifier.create<DApplicationCommand>((original) => {
          if (original.type === "CHAT_INPUT") {
            original.group = info.root ?? info.name;
            original.subgroup = info.root ? info.name : undefined;
          }
        }, DApplicationCommand).decorate(
          myClass.constructor,
          key ?? myClass.name
        )
      );
    } else {
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
