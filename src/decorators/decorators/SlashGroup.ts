import { MetadataStorage, DApplicationCommand, Modifier } from "../..";
import { SubCommand } from "../../types";
import { ClassMethodDecorator } from "../../types/public/decorators";
import { DApplicationCommandGroup } from "../classes/DApplicationCommandGroup";
import { DApplicationCommandOption } from "../classes/DApplicationCommandOption";

/**
 * Group your slash command
 * @param group name of group
 * ___
 * [View Discord.ts Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/slashgroup)
 *
 * [View Discord Documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 */
export function SlashGroup(group: string): ClassMethodDecorator;

/**
 * Group your slash command
 * @param subCommands object
 * ___
 * [View Discord.ts Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/slashgroup)
 *
 * [View Discord Documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 */
export function SlashGroup(subCommands: SubCommand): ClassMethodDecorator;

/**
 * Group your slash command
 * @param group name of group
 * @param description string
 * ___
 * [View Discord.ts Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/slashgroup)
 *
 * [View Discord Documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 */
export function SlashGroup(
  group: string,
  description: string
): ClassMethodDecorator;

/**
 * Group your slash command
 * @param group name of group
 * @param subCommands object
 * ___
 * [View Discord.ts Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/slashgroup)
 *
 * [View Discord Documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 */
export function SlashGroup(
  group: string,
  subCommands: SubCommand
): ClassMethodDecorator;

/**
 * Group your slash command
 * @param group name of group
 * @param description string
 * @param subCommands object
 * ___
 * [View Discord.ts Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/slashgroup)
 *
 * [View Discord Documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 */
export function SlashGroup(
  group: string,
  description: string,
  subCommands: SubCommand
): ClassMethodDecorator;

export function SlashGroup(
  groupOrSubcommands: string | SubCommand,
  subCommandsOrDescription?: SubCommand | string,
  subCommands?: SubCommand
): ClassMethodDecorator {
  return function (
    target: Record<string, any>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    if (typeof groupOrSubcommands === "string" && key) {
      // If @SlashGroup decorate a method edit the method and add it to subgroup
      MetadataStorage.instance.addModifier(
        Modifier.create<DApplicationCommand>((original) => {
          original.subgroup = groupOrSubcommands.toLowerCase();
        }, DApplicationCommand).decorate(target.constructor, key)
      );
    }

    if (!descriptor) {
      if (typeof groupOrSubcommands === "string") {
        const group = DApplicationCommandGroup.create<DApplicationCommand>(
          groupOrSubcommands,
          {
            description:
              typeof subCommandsOrDescription === "string"
                ? subCommandsOrDescription
                : undefined,
          }
        ).decorate(target, key ?? target.name);
        MetadataStorage.instance.addApplicationCommandGroup(group);
      }

      // Create a subgroup if @SlashGroup decorate a method
      if (subCommands) {
        Object.keys(subCommands).forEach((key) => {
          const group =
            DApplicationCommandGroup.create<DApplicationCommandOption>(key, {
              description: subCommands?.[key],
            }).decorate(target, target.name);

          MetadataStorage.instance.addApplicationCommandSubGroup(group);
        });
      }
    }
  };
}
