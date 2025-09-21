/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { MethodDecoratorEx } from "@discordx/internal";

import {
  ComponentType,
  DComponent,
  MetadataStorage,
  type ComponentOptions,
} from "../../index.js";

/**
 * Create modal interaction handler
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/gui/modal-component)
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
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/gui/modal-component)
 *
 * @category Decorator
 */
export function ModalComponent<T extends string>(
  options: ComponentOptions<T>,
): MethodDecoratorEx;

/**
 * Create modal interaction handler
 *
 * @param options - Component options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/gui/modal-component)
 *
 * @category Decorator
 */
export function ModalComponent(options?: ComponentOptions): MethodDecoratorEx {
  return function (target: Record<string, any>, key: string) {
    const button = DComponent.create({
      botIds: options?.botIds,
      guilds: options?.guilds,
      id: options?.id ?? key,
      type: ComponentType.Modal,
    }).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addComponentModal(button);
  };
}
