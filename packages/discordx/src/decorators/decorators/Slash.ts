/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { MethodDecoratorEx } from "@discordx/internal";
import { ApplicationCommandType } from "discord.js";

import type {
  ApplicationCommandOptions,
  NotEmpty,
  VerifyName,
} from "../../index.js";
import {
  DApplicationCommand,
  MetadataStorage,
  SlashNameValidator,
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
export function Slash<T extends string, TD extends string>(
  options: ApplicationCommandOptions<VerifyName<T>, NotEmpty<TD>>,
): MethodDecoratorEx {
  return function (target: Record<string, any>, key: string) {
    const name = options?.name ?? key;
    SlashNameValidator(name);

    const applicationCommand = DApplicationCommand.create({
      botIds: options?.botIds,
      defaultMemberPermissions: options?.defaultMemberPermissions,
      description: options?.description,
      descriptionLocalizations: options?.descriptionLocalizations,
      dmPermission: options?.dmPermission ?? true,
      guilds: options?.guilds,
      name: name,
      nameLocalizations: options?.nameLocalizations,
      nsfw: options?.nsfw,
      type: ApplicationCommandType.ChatInput,
    }).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addApplicationCommandSlash(applicationCommand);
  };
}
