import type {
  ClassDecoratorEx,
  ClassMethodDecorator,
} from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type {
  DApplicationCommandOption,
  SlashGroupOptions,
  VerifyName,
} from "../../index.js";
import {
  DApplicationCommand,
  DApplicationCommandGroup,
  DDiscord,
  MetadataStorage,
  SlashNameValidator,
} from "../../index.js";

/**
 * Create slash group
 *
 * @param options - Group options
 * ___
 *
 * [View discordx documentation](https://discordx.js.orgdocs/packages/discordx/guides/decorators/commands/slash-group)
 *
 * [View discord documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 *
 * @category Decorator
 */
export function SlashGroup<TRoot extends string>(
  options: SlashGroupOptions<VerifyName<TRoot>>
): ClassDecoratorEx;

/**
 * Assign a group to a method or class
 *
 * @param name - Name of group
 * ___
 *
 * [View discordx documentation](https://discordx.js.orgdocs/packages/discordx/guides/decorators/commands/slash-group)
 *
 * [View discord documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 *
 * @category Decorator
 */
export function SlashGroup<TName extends string>(
  name: VerifyName<TName>
): ClassMethodDecorator;

/**
 * Assign a group to a method or class
 *
 * @param name - Name of group
 * @param root - Root name of group
 * ___
 *
 * [View discordx documentation](https://discordx.js.orgdocs/packages/discordx/guides/decorators/commands/slash-group)
 *
 * [View discord documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 *
 * @category Decorator
 */
export function SlashGroup<TName extends string, TRoot extends string>(
  name: VerifyName<TName>,
  root: VerifyName<TRoot>
): ClassMethodDecorator;

/**
 * Assign a group to a method or class
 *
 * @param options - Group options or name
 * @param root - Root name of group
 * ___
 *
 * [View discordx documentation](https://discordx.js.orgdocs/packages/discordx/guides/decorators/commands/slash-group)
 *
 * [View discord documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 *
 * @category Decorator
 */
export function SlashGroup<TName extends string, TRoot extends string>(
  options: string | SlashGroupOptions<VerifyName<TName>>,
  root?: VerifyName<TRoot>
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
      SlashNameValidator(options.name);

      const clazz = target as unknown as new () => unknown;
      if (options.root) {
        MetadataStorage.instance.addApplicationCommandSlashSubGroups(
          DApplicationCommandGroup.create<DApplicationCommandOption>(
            options.name,
            {
              description: options.description,
              descriptionLocalizations: options.descriptionLocalizations,
              nameLocalizations: options.nameLocalizations,
            }
          ).decorate(clazz, clazz.name)
        );
      } else {
        MetadataStorage.instance.addApplicationCommandSlashGroups(
          DApplicationCommandGroup.create<DApplicationCommand>(options.name, {
            defaultMemberPermissions: options.defaultMemberPermissions,
            description: options.description,
            descriptionLocalizations: options.descriptionLocalizations,
            dmPermission: options.dmPermission,
            nameLocalizations: options.nameLocalizations,
          }).decorate(clazz, key ?? clazz.name)
        );
      }
    }
  };
}
