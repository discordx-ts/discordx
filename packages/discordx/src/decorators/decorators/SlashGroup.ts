/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type {
  ClassDecoratorEx,
  ClassMethodDecorator,
} from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type {
  DApplicationCommandOption,
  NotEmpty,
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
 * Assign a group to a method or class
 *
 * @param name - Name of group
 * ___
 *
 * [View discordx documentation](https://discordx.js.org/docs/discordx/decorators/command/slash-group)
 *
 * [View discord documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 *
 * @category Decorator
 */
export function SlashGroup<T extends string>(
  name: VerifyName<T>,
): ClassMethodDecorator;

/**
 * Assign a group to a method or class
 *
 * @param name - Name of group
 * @param root - Root name of group
 * ___
 *
 * [View discordx documentation](https://discordx.js.org/docs/discordx/decorators/command/slash-group)
 *
 * [View discord documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 *
 * @category Decorator
 */
export function SlashGroup<TName extends string, TRoot extends string>(
  name: VerifyName<TName>,
  root: VerifyName<TRoot>,
): ClassMethodDecorator;

/**
 * Create slash group
 *
 * @param options - Group options
 * ___
 *
 * [View discordx documentation](https://discordx.js.org/docs/discordx/decorators/command/slash-group)
 *
 * [View discord documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 *
 * @category Decorator
 */
export function SlashGroup<
  T extends string,
  TD extends string,
  TR extends string,
>(
  options: SlashGroupOptions<VerifyName<T>, NotEmpty<TD>, VerifyName<TR>>,
): ClassDecoratorEx;

/**
 * Assign a group to a method or class
 *
 * @param options - Group options or name
 * @param root - Root name of group
 * ___
 *
 * [View discordx documentation](https://discordx.js.org/docs/discordx/decorators/command/slash-group)
 *
 * [View discord documentation](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups)
 *
 * @category Decorator
 */
export function SlashGroup<
  T extends string,
  TD extends string,
  TR extends string,
>(
  options:
    | string
    | SlashGroupOptions<VerifyName<T>, NotEmpty<TD>, VerifyName<TR>>,
  root?: VerifyName<TR>,
): ClassMethodDecorator {
  return function (
    target: Record<string, any>,
    key?: string,
    descriptor?: PropertyDescriptor,
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
          DDiscord,
        ).decorateUnknown(target, key, descriptor),
      );
    } else {
      SlashNameValidator(options.name);

      const clazz = target as unknown as new () => unknown;
      if (options.root) {
        MetadataStorage.instance.addApplicationCommandSlashSubGroups(
          DApplicationCommandGroup.create<DApplicationCommandOption>({
            name: options.name,
            payload: {
              description: options.description,
              descriptionLocalizations: options.descriptionLocalizations,
              nameLocalizations: options.nameLocalizations,
            },
            root: options.root,
          }).decorate(clazz, clazz.name),
        );
      } else {
        MetadataStorage.instance.addApplicationCommandSlashGroups(
          DApplicationCommandGroup.create<DApplicationCommand>({
            name: options.name,
            payload: {
              defaultMemberPermissions: options.defaultMemberPermissions,
              description: options.description,
              descriptionLocalizations: options.descriptionLocalizations,
              dmPermission: options.dmPermission,
              nameLocalizations: options.nameLocalizations,
            },
          }).decorate(clazz, key ?? clazz.name),
        );
      }
    }
  };
}
