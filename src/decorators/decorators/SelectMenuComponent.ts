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
export function SelectMenuComponent(id?: string): MethodDecoratorEx;

/**
 * Define a select menu interaction handler
 * @param id custom id for your select menu
 * @param params additional configuration
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/selectmenucomponent)
 * @category Decorator
 */
export function SelectMenuComponent(
  id: string,
  params?: { guilds?: IGuild[]; botIds?: string[] }
): MethodDecoratorEx;

export function SelectMenuComponent(
  id?: string,
  params?: { guilds?: IGuild[]; botIds?: string[] }
): MethodDecoratorEx {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function <T>(target: Record<string, T>, key: string) {
    const button = DComponentSelectMenu.create(
      id ?? key,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addComponentSelectMenu(button);
  };
}
