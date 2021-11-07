import {
  DComponentSelectMenu,
  IGuild,
  MetadataStorage,
  MethodDecoratorEx,
} from "../..";

/**
 * Define a select menu interaction handler
 * @param id custom id for your select menu
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/selectmenucomponent)
 * @category Decorator
 */
export function SelectMenuComponent(id?: string | RegExp): MethodDecoratorEx;

/**
 * Define a select menu interaction handler
 * @param id custom id for your select menu
 * @param params additional configuration
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/selectmenucomponent)
 * @category Decorator
 */
export function SelectMenuComponent(
  id: string | RegExp,
  params?: { botIds?: string[]; guilds?: IGuild[] }
): MethodDecoratorEx;

export function SelectMenuComponent(
  id?: string | RegExp,
  params?: { botIds?: string[]; guilds?: IGuild[] }
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    const button = DComponentSelectMenu.create(
      id ?? key,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addComponentSelectMenu(button);
  };
}
