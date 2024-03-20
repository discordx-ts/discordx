/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { MethodDecoratorEx } from "@discordx/internal";

import { ComponentType, DComponent, MetadataStorage } from "../../index.js";
import type { ComponentOptions } from "../../types/index.js";

/**
 * Interact with select menu with a defined identifier
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/gui/select-menu-component)
 *
 * @category Decorator
 */
export function SelectMenuComponent(): MethodDecoratorEx;

/**
 * Interact with select menu with a defined identifier
 *
 * @param options - Component options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/gui/select-menu-component)
 *
 * @category Decorator
 */
export function SelectMenuComponent<T extends string>(
  options: ComponentOptions<T>,
): MethodDecoratorEx;

/**
 * Interact with select menu with a defined identifier
 *
 * @param options - Component options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/gui/select-menu-component)
 *
 * @category Decorator
 */
export function SelectMenuComponent(
  options?: ComponentOptions,
): MethodDecoratorEx {
  return function (target: Record<string, any>, key: string) {
    const button = DComponent.create({
      botIds: options?.botIds,
      guilds: options?.guilds,
      id: options?.id ?? key,
      type: ComponentType.SelectMenu,
    }).decorate(target.constructor, key, target[key]);

    MetadataStorage.instance.addComponentSelectMenu(button);
  };
}
