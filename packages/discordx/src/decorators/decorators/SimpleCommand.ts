import type { MethodDecoratorEx } from "@discordx/internal";

import type { NotEmpty, SimpleCommandParams } from "../../index.js";
import { DSimpleCommand, MetadataStorage } from "../../index.js";

/**
 * Create a simple command handler for messages using ``@SimpleCommand``. Example ``!hello world``
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/simplecommand)
 */
export function SimpleCommand(): MethodDecoratorEx;
export function SimpleCommand<T extends string>(
  name: NotEmpty<T>
): MethodDecoratorEx;
export function SimpleCommand<T extends string>(
  name: NotEmpty<T>,
  params: SimpleCommandParams
): MethodDecoratorEx;

export function SimpleCommand(
  name?: string,
  params?: SimpleCommandParams
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    name = name ?? key;

    const cmd = DSimpleCommand.create(
      name,
      params?.aliases,
      params?.argSplitter,
      params?.botIds,
      params?.defaultPermission,
      params?.description,
      params?.directMessage,
      params?.guilds,
      params?.prefix
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addSimpleCommand(cmd);
  };
}
