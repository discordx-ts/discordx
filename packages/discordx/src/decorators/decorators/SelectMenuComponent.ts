import type { MethodDecoratorEx } from "@discordx/internal";

import type { IGuild } from "../../index.js";
import { ComponentType, DComponent, MetadataStorage } from "../../index.js";

/**
 * Interact with select menu with a defined identifier
 *
 * @param id - Select menu identifier
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/selectmenucomponent)
 *
 * @category Decorator
 */
export function SelectMenuComponent(id?: string | RegExp): MethodDecoratorEx;

/**
 * Interact with select menu with a defined identifier
 *
 * @param id - Select menu identifier
 * @param options - Options for the select menu
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/selectmenucomponent)
 *
 * @category Decorator
 */
export function SelectMenuComponent(
  id: string | RegExp,
  options?: { botIds?: string[]; guilds?: IGuild[] }
): MethodDecoratorEx;

export function SelectMenuComponent(
  id?: string | RegExp,
  options?: { botIds?: string[]; guilds?: IGuild[] }
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    const button = DComponent.create(
      ComponentType.SelectMenu,
      id ?? key,
      options?.guilds,
      options?.botIds
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addComponentSelectMenu(button);
  };
}
