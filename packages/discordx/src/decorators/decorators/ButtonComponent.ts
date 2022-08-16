import type { MethodDecoratorEx } from "@discordx/internal";

import { ComponentType, DComponent, MetadataStorage } from "../../index.js";
import type { ComponentOptions } from "../../types/index.js";

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
 * @param options - Component options
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/button-component)
 *
 * @category Decorator
 */
export function ButtonComponent<T extends string>(
  options?: ComponentOptions<T>
): MethodDecoratorEx;

export function ButtonComponent(options?: ComponentOptions): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    const button = DComponent.create({
      botIds: options?.botIds,
      guilds: options?.guilds,
      id: options?.id ?? key,
      type: ComponentType.Button,
    }).decorate(target.constructor, key, target[key]);
    MetadataStorage.instance.addComponentButton(button);
  };
}
