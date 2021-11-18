import {
  DSimpleCommand,
  MetadataStorage,
  MethodDecoratorEx,
  SimpleCommandParams,
} from "../../index.mjs";

/**
 * Create a simple command handler for messages using ``@SimpleCommand``. Example ``!hello world``
 * ___
 * [View Documentation](https://discord-ts.mjs.org/docs/decorators/commands/simplecommand)
 */
export function SimpleCommand(): MethodDecoratorEx;

/**
 * Create a simple command handler for messages using ``@SimpleCommand``. Example ``!hello world``
 * @param name command name
 * ___
 * [View Documentation](https://discord-ts.mjs.org/docs/decorators/commands/simplecommand)
 * @category Decorator
 */
export function SimpleCommand(name: string): MethodDecoratorEx;

/**
 * Create a simple command handler for messages using ``@SimpleCommand``. Example ``!hello world``
 * @param name command name
 * @param params additional configuration
 * ___
 * [View Documentation](https://discord-ts.mjs.org/docs/decorators/commands/simplecommand)
 * @category Decorator
 */
export function SimpleCommand(
  name: string,
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
