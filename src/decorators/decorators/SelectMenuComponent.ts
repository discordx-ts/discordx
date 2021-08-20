import {
  DComponentSelectMenu,
  MetadataStorage,
  MethodDecoratorEx,
} from "../..";
import { Snowflake } from "discord.js";

/**
 * Define a select menu interaction handler
 * @param id custom id for your select menu
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/gui/selectmenucomponent)
 */
export function SelectMenuComponent(id?: string): MethodDecoratorEx;

/**
 * Define a select menu interaction handler
 * @param id custom id for your select menu
 * @param params additional configuration
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/gui/selectmenucomponent)
 */
export function SelectMenuComponent(
  id: string,
  params?: { guilds?: Snowflake[]; botIds?: string[] }
): MethodDecoratorEx;

export function SelectMenuComponent(
  id?: string,
  params?: { guilds?: Snowflake[]; botIds?: string[] }
): MethodDecoratorEx {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: Record<string, any>, key: string) {
    const button = DComponentSelectMenu.create(
      id ?? key,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addComponentSelectMenu(button);
  };
}
