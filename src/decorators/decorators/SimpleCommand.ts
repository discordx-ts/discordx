import {
  DSimpleCommand,
  MetadataStorage,
  MethodDecoratorEx,
  SimpleCommandParams,
} from "../..";

const testName = RegExp(/^[a-zA-Z0-9 ]+$/);

/**
 * Create a simple command handler for messages using ``@SimpleCommand``. Example ``!hello world``
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/simplecommand)
 */
export function SimpleCommand(): MethodDecoratorEx;

/**
 * Create a simple command handler for messages using ``@SimpleCommand``. Example ``!hello world``
 * @param name command name
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/simplecommand)
 * @category Decorator
 */
export function SimpleCommand(name: string): MethodDecoratorEx;

/**
 * Create a simple command handler for messages using ``@SimpleCommand``. Example ``!hello world``
 * @param name command name
 * @param params additional configuration
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/simplecommand)
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
    name = name;

    if (!testName.test(name)) {
      throw Error("invalid command name");
    }

    if (params?.aliases) {
      if (params.aliases.some((aName) => !testName.test(aName))) {
        throw Error("invalid command alias");
      }
    }

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
