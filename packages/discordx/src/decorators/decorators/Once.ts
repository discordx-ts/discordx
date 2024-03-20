/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { MethodDecoratorEx } from "@discordx/internal";

import type { EventOptions, RestEventOptions } from "../../index.js";
import { DOn, MetadataStorage } from "../../index.js";

/**
 * Handle discord events once only with a defined handler
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/once)
 *
 * @category Decorator
 */
export function Once(): MethodDecoratorEx;

/**
 * Handle discord events once only with a defined handler
 *
 * @param options - Event parameters
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/once)
 *
 * @category Decorator
 */
export function Once(options: EventOptions): MethodDecoratorEx;

/**
 * Handle discord events once only with a defined handler
 *
 * @param options - Event parameters
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/once)
 *
 * @category Decorator
 */
export function Once(options?: EventOptions): MethodDecoratorEx {
  return function (
    target: Record<string, any>,
    key: string,
    descriptor: PropertyDescriptor,
  ) {
    const clazz = target as unknown as new () => unknown;
    const on = DOn.create({
      botIds: options?.botIds,
      event: options?.event ?? key,
      once: true,
      priority: options?.priority,
      rest: false,
    }).decorate(clazz.constructor, key, descriptor.value);

    MetadataStorage.instance.addOn(on);
  };
}

/**
 * Handle discord rest events with a defined handler
 *
 * @param options - Rest event options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/once#rest)
 *
 * @category Decorator
 */
Once.rest = function (options?: RestEventOptions): MethodDecoratorEx {
  return function (
    target: Record<string, any>,
    key: string,
    descriptor?: PropertyDescriptor,
  ) {
    const clazz = target as unknown as new () => unknown;
    const on = DOn.create({
      botIds: options?.botIds,
      event: options?.event ?? key,
      once: true,
      priority: options?.priority,
      rest: true,
    }).decorate(clazz.constructor, key, descriptor?.value);

    MetadataStorage.instance.addOn(on);
  };
};
