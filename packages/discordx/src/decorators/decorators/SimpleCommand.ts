/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { MethodDecoratorEx } from "@discordx/internal";

import {
  DSimpleCommand,
  MetadataStorage,
  type SimpleCommandOptions,
} from "../../index.js";

/**
 * Handle a simple command with a defined name
 *
 * Example ``!hello world``
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/simple-command)
 *
 * @category Decorator
 */
export function SimpleCommand(): MethodDecoratorEx;

/**
 * Handle a simple command with a defined name
 *
 * Example ``!hello world``
 *
 * @param options - Command options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/simple-command)
 *
 * @category Decorator
 */
export function SimpleCommand<T extends string>(
  options: SimpleCommandOptions<T>,
): MethodDecoratorEx;

/**
 * Handle a simple command with a defined name
 *
 * Example ``!hello world``
 *
 * @param options - Command options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/simple-command)
 *
 * @category Decorator
 */
export function SimpleCommand(
  options?: SimpleCommandOptions,
): MethodDecoratorEx {
  return (target, key) => {
    const cmd = DSimpleCommand.create({
      aliases: options?.aliases,
      argSplitter: options?.argSplitter,
      botIds: options?.botIds,
      description: options?.description,
      directMessage: options?.directMessage,
      guilds: options?.guilds,
      name: options?.name ?? key,
      prefix: options?.prefix,
    }).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addSimpleCommand(cmd);
  };
}
