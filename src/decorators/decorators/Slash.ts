import {
  ApplicationCommandParams,
  DApplicationCommand,
  MetadataStorage,
  MethodDecoratorEx,
  VerifyName,
} from "../..";

/**
 * Define slash command
 * @param name name of your slash command
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/slash)
 * @category Decorator
 */
export function Slash<T extends string>(
  name?: VerifyName<T>
): MethodDecoratorEx;

/**
 * Define slash command
 * @param name name of your slash command
 * @param params additional configuration for slash
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/slash)
 * @category Decorator
 */
export function Slash<T extends string>(
  name?: VerifyName<T>,
  params?: ApplicationCommandParams
): MethodDecoratorEx;
export function Slash(
  name?: string,
  params?: ApplicationCommandParams
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    name = name ?? key;

    const applicationCommand = DApplicationCommand.create(
      name,
      "CHAT_INPUT",
      params?.description,
      params?.defaultPermission,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addApplicationCommand(applicationCommand);
  };
}
