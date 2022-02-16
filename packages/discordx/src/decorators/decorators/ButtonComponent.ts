import type { MethodDecoratorEx } from "@discordx/internal";

import type { IGuild } from "../../index.js";
import { ComponentTypeX, DComponent, MetadataStorage } from "../../index.js";

/**
 * Interact with buttons with a defined identifier
 *
 * @param id - Button identifier
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/buttoncomponent)
 *
 * @category Decorator
 */
export function ButtonComponent(id?: string | RegExp): MethodDecoratorEx;

/**
 * Interact with buttons with a defined identifier
 *
 * @param id - Button identifier
 * @param options - Options for the button component
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/buttoncomponent)
 *
 * @category Decorator
 */
export function ButtonComponent(
  id: string | RegExp,
  options?: { botIds?: string[]; guilds?: IGuild[] }
): MethodDecoratorEx;

export function ButtonComponent(
  id?: string | RegExp,
  options?: { botIds?: string[]; guilds?: IGuild[] }
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    const button = DComponent.create(
      ComponentTypeX.Button,
      id ?? key,
      options?.guilds,
      options?.botIds
    ).decorate(target.constructor, key, target[key]);
    MetadataStorage.instance.addComponentButton(button);
  };
}
