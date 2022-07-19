import type { MethodDecoratorEx } from "@discordx/internal";

import type { IGuild } from "../../index.js";
import { ComponentType, DComponent, MetadataStorage } from "../../index.js";
import type { NotEmpty } from "../../types/index.js";

/**
 * Interact with buttons with a defined identifier
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/button-component)
 *
 * @category Decorator
 */
export function ButtonComponent(): MethodDecoratorEx;

/**
 * Interact with buttons with a defined identifier
 *
 * @param id - Button identifier
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/button-component)
 *
 * @category Decorator
 */
export function ButtonComponent<T extends string>(
  id: NotEmpty<T>
): MethodDecoratorEx;

/**
 * Interact with buttons with a defined identifier
 *
 * @param id - Button identifier
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/button-component)
 *
 * @category Decorator
 */
export function ButtonComponent(id: RegExp): MethodDecoratorEx;

/**
 * Interact with buttons with a defined identifier
 *
 * @param id - Button identifier
 * @param options - Options for the button component
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/button-component)
 *
 * @category Decorator
 */
export function ButtonComponent<T extends string>(
  id: NotEmpty<T>,
  options: { botIds?: string[]; guilds?: IGuild[] }
): MethodDecoratorEx;

/**
 * Interact with buttons with a defined identifier
 *
 * @param id - Button identifier
 * @param options - Options for the button component
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/button-component)
 *
 * @category Decorator
 */
export function ButtonComponent(
  id: RegExp,
  options: { botIds?: string[]; guilds?: IGuild[] }
): MethodDecoratorEx;

export function ButtonComponent(
  id?: string | RegExp,
  options?: { botIds?: string[]; guilds?: IGuild[] }
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    const button = DComponent.create({
      botIds: options?.botIds,
      guilds: options?.guilds,
      id: id ?? key,
      type: ComponentType.Button,
    }).decorate(target.constructor, key, target[key]);
    MetadataStorage.instance.addComponentButton(button);
  };
}
