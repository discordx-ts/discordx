import {
  MetadataStorage,
  DApplicationCommand,
  ApplicationCommandParams,
} from "../..";
import { MethodDecoratorEx } from "../../types/public/decorators";

/**
 * Define slash command
 * @param name name of your slash command
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/slash)
 */
export function Slash(name?: string): MethodDecoratorEx;

/**
 * Define slash command
 * @param name name of your slash command
 * @param params additional configuration for slash
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/slash)
 */
export function Slash(
  name?: string,
  params?: ApplicationCommandParams
): MethodDecoratorEx;
export function Slash(name?: string, params?: ApplicationCommandParams) {
  return function (target: Record<string, any>, key: string) {
    name = name ?? key;
    name = name.toLocaleLowerCase();

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
