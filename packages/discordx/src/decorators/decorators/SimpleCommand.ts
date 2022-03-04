import type { MethodDecoratorEx } from "@discordx/internal";

import type { NotEmpty, SimpleCommandOptions } from "../../index.js";
import { DSimpleCommand, MetadataStorage } from "../../index.js";

/**
 * Handle a simple command with a defined name
 *
 * Example ``!hello world``
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/simple-command)
 *
 * @category Decorator
 */
export function SimpleCommand(): MethodDecoratorEx;

/**
 * Handle a simple command with a defined name
 *
 * Example ``!hello world``
 *
 * @param name - Command name
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/simple-command)
 *
 * @category Decorator
 */
export function SimpleCommand<T extends string>(
  name: NotEmpty<T>
): MethodDecoratorEx;

/**
 * Handle a simple command with a defined name
 *
 * Example ``!hello world``
 *
 * @param name - Command name
 * @param options - Command options
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/simple-command)
 *
 * @category Decorator
 */
export function SimpleCommand<T extends string>(
  name: NotEmpty<T>,
  options: SimpleCommandOptions
): MethodDecoratorEx;

export function SimpleCommand(
  name?: string,
  options?: SimpleCommandOptions
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    name = name ?? key;

    const cmd = DSimpleCommand.create(
      name,
      options?.aliases,
      options?.argSplitter,
      options?.botIds,
      options?.defaultPermission,
      options?.description,
      options?.directMessage,
      options?.guilds,
      options?.prefix
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addSimpleCommand(cmd);
  };
}
