import type { ClassMethodDecorator } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type {
  DApplicationCommandOption,
  SubCommand,
  VerifyName,
} from "../../index.js";
import {
  DApplicationCommand,
  DApplicationCommandGroup,
  MetadataStorage,
} from "../../index.js";

/**
 * Group your slash command
 * @param group name of group
 * ___
 * [View Discord.ts Documentation](https://discord-ts.js.org/docs/decorators/commands/slashgroup)
 *
 * [View Discord Documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 * @category Decorator
 */
export function SlashGroup<T extends string>(
  group: VerifyName<T>
): ClassMethodDecorator;

/**
 * Group your slash command
 * @param subCommands object
 * ___
 * [View Discord.ts Documentation](https://discord-ts.js.org/docs/decorators/commands/slashgroup)
 *
 * [View Discord Documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 * @category Decorator
 */
export function SlashGroup(subCommands: SubCommand): ClassMethodDecorator;

/**
 * Group your slash command
 * @param group name of group
 * @param description string
 * ___
 * [View Discord.ts Documentation](https://discord-ts.js.org/docs/decorators/commands/slashgroup)
 *
 * [View Discord Documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 * @category Decorator
 */
export function SlashGroup<T extends string>(
  group: VerifyName<T>,
  description: string
): ClassMethodDecorator;

/**
 * Group your slash command
 * @param group name of group
 * @param subCommands object
 * ___
 * [View Discord.ts Documentation](https://discord-ts.js.org/docs/decorators/commands/slashgroup)
 *
 * [View Discord Documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 * @category Decorator
 */
export function SlashGroup<T extends string>(
  group: VerifyName<T>,
  subCommands: SubCommand
): ClassMethodDecorator;

/**
 * Group your slash command
 * @param group name of group
 * @param description string
 * @param subCommands object
 * ___
 * [View Discord.ts Documentation](https://discord-ts.js.org/docs/decorators/commands/slashgroup)
 *
 * [View Discord Documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 * @category Decorator
 */
export function SlashGroup<T extends string>(
  group: VerifyName<T>,
  description: string,
  subCommands: SubCommand
): ClassMethodDecorator;

export function SlashGroup(
  groupOrSubcommands: string | SubCommand,
  subCommandsOrDescription?: SubCommand | string,
  subCommands?: SubCommand
): ClassMethodDecorator {
  return function <T>(
    target: T,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    const myClass = target as unknown as new () => unknown;

    if (descriptor && typeof groupOrSubcommands === "string" && key) {
      // If @SlashGroup decorate a method edit the method and add it to subgroup
      MetadataStorage.instance.addModifier(
        Modifier.create<DApplicationCommand>((original) => {
          if (original.type === "CHAT_INPUT") {
            original.subgroup = groupOrSubcommands;
          }
        }, DApplicationCommand).decorate(myClass.constructor, key)
      );
    }

    if (typeof groupOrSubcommands === "string") {
      const group = DApplicationCommandGroup.create<DApplicationCommand>(
        groupOrSubcommands,
        {
          description:
            typeof subCommandsOrDescription === "string"
              ? subCommandsOrDescription
              : undefined,
        }
      ).decorate(myClass, key ?? myClass.name);
      MetadataStorage.instance.addApplicationCommandSlashGroups(group);
    }

    // Create a subgroup if @SlashGroup decorate a method
    const anySubCommands = subCommands
      ? subCommands
      : typeof subCommandsOrDescription !== "string"
      ? subCommandsOrDescription
      : undefined;

    if (anySubCommands) {
      Object.keys(anySubCommands).forEach((subKey) => {
        const group =
          DApplicationCommandGroup.create<DApplicationCommandOption>(subKey, {
            description: anySubCommands?.[subKey],
          }).decorate(myClass, myClass.name);

        MetadataStorage.instance.addApplicationCommandSlashSubGroups(group);
      });
    }
  };
}
