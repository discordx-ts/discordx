/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { MethodDecoratorEx } from "@discordx/internal";
import { ApplicationCommandType, SlashCommandBuilder } from "discord.js";

import {
  DApplicationCommand,
  MetadataStorage,
  SlashNameValidator,
  type ApplicationCommandOptions,
  type NotEmpty,
  type VerifyName,
} from "../../index.js";

/**
 * Handle a slash command with a defined name
 *
 * @param options - Application command options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/slash)
 *
 * @category Decorator
 */
export function Slash(options: SlashCommandBuilder): MethodDecoratorEx;

/**
 * Handle a slash command with a defined name
 *
 * @param options - Application command options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/slash)
 *
 * @category Decorator
 */
export function Slash<T extends string, TD extends string>(
  options: ApplicationCommandOptions<VerifyName<T>, NotEmpty<TD>>,
): MethodDecoratorEx;

/**
 * Handle a slash command with a defined name
 *
 * @param options - Application command options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/slash)
 *
 * @category Decorator
 */
export function Slash<T extends string, TD extends string>(
  options:
    | ApplicationCommandOptions<VerifyName<T>, NotEmpty<TD>>
    | SlashCommandBuilder,
): MethodDecoratorEx {
  return function (target: Record<string, any>, key: string) {
    const name = options.name ?? key;
    SlashNameValidator(name);

    let applicationCommand: DApplicationCommand;

    if (options instanceof SlashCommandBuilder) {
      if (options.options.length > 0) {
        throw Error(
          "The builder options feature is not supported in discordx.",
        );
      }

      applicationCommand = DApplicationCommand.create({
        defaultMemberPermissions: options.default_member_permissions,
        description: options.description,
        descriptionLocalizations: options.description_localizations,
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        dmPermission: options.dm_permission ?? true,
        contexts: options.contexts,
        integrationTypes: options.integration_types,
        name: name,
        nameLocalizations: options.name_localizations,
        nsfw: options.nsfw,
        type: ApplicationCommandType.ChatInput,
      });
    } else {
      applicationCommand = DApplicationCommand.create({
        botIds: options.botIds,
        defaultMemberPermissions: options.defaultMemberPermissions,
        description: options.description,
        descriptionLocalizations: options.descriptionLocalizations,
        dmPermission: options.dmPermission ?? true,
        contexts: options.contexts,
        integrationTypes: options.integrationTypes,
        guilds: options.guilds,
        name: name,
        nameLocalizations: options.nameLocalizations,
        nsfw: options.nsfw,
        type: ApplicationCommandType.ChatInput,
      });
    }

    applicationCommand.decorate(target.constructor, key, target[key]);
    MetadataStorage.instance.addApplicationCommandSlash(applicationCommand);
  };
}
