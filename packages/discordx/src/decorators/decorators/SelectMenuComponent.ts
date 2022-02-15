import type { MethodDecoratorEx } from "@discordx/internal";

import type { IGuild } from "../../index.js";
import { ComponentTypeX, DComponent, MetadataStorage } from "../../index.js";

/**
 * Define a select menu interaction handler
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/selectmenucomponent)
 * @category Decorator
 */
export function SelectMenuComponent(id?: string | RegExp): MethodDecoratorEx;
export function SelectMenuComponent(
  id: string | RegExp,
  params?: { botIds?: string[]; guilds?: IGuild[] }
): MethodDecoratorEx;

export function SelectMenuComponent(
  id?: string | RegExp,
  params?: { botIds?: string[]; guilds?: IGuild[] }
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    const button = DComponent.create(
      ComponentTypeX.SelectMenu,
      id ?? key,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addComponentSelectMenu(button);
  };
}
