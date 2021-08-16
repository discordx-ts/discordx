import { MetadataStorage } from "../..";
import { MethodDecoratorEx } from "../../types/public/decorators";
import { DSimpleCommand } from "../classes/DSimpleCommand";
import { CommandParams } from "../params/CommandParams";

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
 */
export function SimpleCommand(name: string): MethodDecoratorEx;

/**
 * Create a simple command handler for messages using ``@SimpleCommand``. Example ``!hello world``
 * @param name command name
 * @param params additional configuration
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/simplecommand)
 */
export function SimpleCommand(
  name: string,
  params: CommandParams
): MethodDecoratorEx;

export function SimpleCommand(name?: string, params?: CommandParams) {
  return function (target: Record<string, any>, key: string) {
    name = name ?? key;
    name = name.toLocaleLowerCase();
    if (!testName.test(name)) throw Error("invalid command name");
    if (params?.aliases) {
      if (params.aliases.some((name) => !testName.test(name))) {
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
