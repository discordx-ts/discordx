import type { MethodDecoratorEx } from "@discordx/internal";

import type { ComponentOptions } from "../../index.js";
import { ComponentType, DComponent, MetadataStorage } from "../../index.js";

/**
 * Create modal interaction handler
 * ___
 *
 * [View Documentation](https://discordx.js.orgdocs/packages/discordx/guides/decorators/gui/modal-component)
 *
 * @category Decorator
 */
export function ModalComponent(): MethodDecoratorEx;

/**
 * Create modal interaction handler
 *
 * @param options - Component options
 * ___
 *
 * [View Documentation](https://discordx.js.orgdocs/packages/discordx/guides/decorators/gui/modal-component)
 *
 * @category Decorator
 */
export function ModalComponent<T extends string>(
  options: ComponentOptions<T>
): MethodDecoratorEx;

/**
 * Create modal interaction handler
 *
 * @param options - Component options
 * ___
 *
 * [View Documentation](https://discordx.js.orgdocs/packages/discordx/guides/decorators/gui/modal-component)
 *
 * @category Decorator
 */
export function ModalComponent(options?: ComponentOptions): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    const button = DComponent.create({
      botIds: options?.botIds,
      guilds: options?.guilds,
      id: options?.id ?? key,
      type: ComponentType.Modal,
    }).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addComponentModal(button);
  };
}
