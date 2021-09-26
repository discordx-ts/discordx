import {
  DComponentButton,
  IGuild,
  MetadataStorage,
  MethodDecoratorEx,
} from "../..";

/**
 * Define button interaction handler
 * @param id your button custom id
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/gui/buttoncomponent)
 * @category Decorator
 */
export function ButtonComponent(id?: string): MethodDecoratorEx;

/**
 * Define button interaction handler
 * @param id your button custom id
 * @param params additional configuration for button component
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/gui/buttoncomponent)
 * @category Decorator
 */
export function ButtonComponent(
  id: string,
  params?: { guilds?: IGuild[]; botIds?: string[] }
): MethodDecoratorEx;

export function ButtonComponent(
  id?: string,
  params?: { guilds?: IGuild[]; botIds?: string[] }
): MethodDecoratorEx {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: Record<string, any>, key: string) => {
    const button = DComponentButton.create(
      id ?? key,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);
    MetadataStorage.instance.addComponentButton(button);
  };
}
