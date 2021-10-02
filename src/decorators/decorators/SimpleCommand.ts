import {
  DSimpleCommand,
  MetadataStorage,
  MethodDecoratorEx,
  SimpleCommandParams,
} from "../..";

/**
 * Create a simple command handler for messages using ``@SimpleCommand``. Example ``!hello world``
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/simplecommand)
 */
export function SimpleCommand(): MethodDecoratorEx;

/**
 * Create a simple command handler for messages using ``@SimpleCommand``. Example ``!hello world``
 * @param name command name
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/simplecommand)
 * @category Decorator
 */
export function SimpleCommand(name: string): MethodDecoratorEx;

/**
 * Create a simple command handler for messages using ``@SimpleCommand``. Example ``!hello world``
 * @param name command name
 * @param params additional configuration
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/simplecommand)
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: Record<string, any>, key: string) {
    name = name ?? key;

    const cmd = DSimpleCommand.create(
      name,
      params?.description,
      params?.argSplitter,
      params?.directMessage,
      params?.defaultPermission,
      params?.guilds,
      params?.botIds,
      params?.aliases
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addSimpleCommand(cmd);
  };
}
