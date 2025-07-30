/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { MethodDecoratorEx } from "@discordx/internal";
import { SlashCommandBuilder } from "discord.js";

import type { ApplicationCommandOptions } from "../../index.js";
import { Slash } from "../../index.js";

/**
 * Handle a slash command with a defined name and aliases
 *
 * @param command - Application command options
 * @param aliases - Command aliases
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/slash)
 *
 * @category Decorator
 */
export function SlashWithAliases(
  command: SlashCommandBuilder,
  aliases: Lowercase<string>[],
): MethodDecoratorEx;

/**
 * Handle a slash command with a defined name and aliases
 *
 * @param command - Application command options
 * @param aliases - Command aliases
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/slash)
 *
 * @category Decorator
 */
export function SlashWithAliases<T extends Lowercase<string>>(
  command: ApplicationCommandOptions<T, string>,
  aliases: T[],
): MethodDecoratorEx;

/**
 * Handle a slash command with a defined name and aliases
 *
 * @param command - Application command options
 * @param aliases - Command aliases
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/slash)
 *
 * @category Decorator
 */
export function SlashWithAliases<T extends Lowercase<string>>(
  command: ApplicationCommandOptions<T, string> | SlashCommandBuilder,
  aliases: T[],
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const allNames = [command.name, ...aliases];

    for (const name of allNames) {
      if (command instanceof SlashCommandBuilder) {
        if (name) {
          command.setName(name);
        }

        Slash(command)(target, propertyKey, descriptor);

        continue;
      }

      Slash({ ...command, name: name as Lowercase<string> })(
        target,
        propertyKey,
        descriptor,
      );
    }
  };
}
