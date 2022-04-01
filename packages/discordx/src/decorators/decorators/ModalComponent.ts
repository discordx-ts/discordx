import type { MethodDecoratorEx } from "@discordx/internal";

import type { IGuild } from "../../index.js";
import { ComponentType, DComponent, MetadataStorage } from "../../index.js";

/**
 * Create modal interaction handler
 *
 * @param id - Custom identifier
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/modal-component)
 *
 * @category Decorator
 */
export function ModalComponent(id?: string | RegExp): MethodDecoratorEx;

/**
 * Create modal interaction handler
 *
 * @param id - Custom identifier
 * @param options - Options
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/gui/modal-component)
 *
 * @category Decorator
 */
export function ModalComponent(
  id: string | RegExp,
  options?: { botIds?: string[]; guilds?: IGuild[] }
): MethodDecoratorEx;

export function ModalComponent(
  id?: string | RegExp,
  params?: { botIds?: string[]; guilds?: IGuild[] }
): MethodDecoratorEx {
  return function <T>(target: Record<string, T>, key: string) {
    const button = DComponent.create(
      ComponentType.Modal,
      id ?? key,
      params?.guilds,
      params?.botIds
    ).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addComponentModal(button);
  };
}
