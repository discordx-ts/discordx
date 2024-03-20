/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { MethodDecoratorEx } from "@discordx/internal";
import { ApplicationCommandType } from "discord.js";

import type { ApplicationCommandOptions } from "../../index.js";
import { DApplicationCommand, MetadataStorage } from "../../index.js";
import type { NotEmpty } from "../../types/index.js";

/**
 * Interact with context menu with a defined identifier
 *
 * @param options - Application command options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/gui/context-menu)
 *
 * @category Decorator
 */
export function ContextMenu<TName extends string>(
  options: Omit<
    ApplicationCommandOptions<NotEmpty<TName>, never> & {
      type: Exclude<ApplicationCommandType, ApplicationCommandType.ChatInput>;
    },
    "description" | "descriptionLocalizations"
  >,
): MethodDecoratorEx {
  return function (target: Record<string, any>, key: string) {
    const applicationCommand = DApplicationCommand.create({
      botIds: options.botIds,
      defaultMemberPermissions: options.defaultMemberPermissions,
      description: "",
      dmPermission: options.dmPermission,
      guilds: options.guilds,
      name: options.name ?? key,
      nameLocalizations: options.nameLocalizations,
      type: options.type,
    }).decorate(target.constructor, key, target[key]);

    if (options.type === ApplicationCommandType.Message) {
      MetadataStorage.instance.addApplicationCommandMessage(applicationCommand);
    } else {
      MetadataStorage.instance.addApplicationCommandUser(applicationCommand);
    }
  };
}
