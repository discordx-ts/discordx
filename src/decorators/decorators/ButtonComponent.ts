import {
  DComponentButton,
  IGuild,
  MetadataStorage,
  MethodDecoratorEx,
} from "../../index.js";

/**
 * Define button interaction handler
 * @param id your button custom id
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/buttoncomponent)
 * @category Decorator
 */
export function ButtonComponent(id?: string | RegExp): MethodDecoratorEx;

/**
 * Define button interaction handler
 * @param id your button custom id
 * @param params additional configuration for button component
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/buttoncomponent)
 * @category Decorator
 */
export function ButtonComponent(
  id: string | RegExp,
  params?: { botIds?: string[]; guilds?: IGuild[] }
): MethodDecoratorEx;

export function ButtonComponent(
  id?: string | RegExp,
  params?: { botIds?: string[]; guilds?: IGuild[] }
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    const button = DComponentButton.create(
      id ?? key,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);
    MetadataStorage.instance.addComponentButton(button);
  };
}
