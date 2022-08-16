import type { MethodDecoratorEx } from "@discordx/internal";

import type { EventOptions, RestEventOptions } from "../../index.js";
import { DOn, MetadataStorage } from "../../index.js";

/**
 * Handle discord events with a defined handler
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/on)
 *
 * @category Decorator
 */
export function On(): MethodDecoratorEx;

/**
 * Handle discord events with a defined handler
 *
 * @param options - Event options
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/on)
 *
 * @category Decorator
 */
export function On(options: EventOptions): MethodDecoratorEx;

/**
 * Handle discord events with a defined handler
 *
 * @param options - Event options
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/on)
 *
 * @category Decorator
 */
export function On(options?: EventOptions): MethodDecoratorEx {
  return function <T>(
    target: Record<string, T>,
    key: string,
    descriptor?: PropertyDescriptor
  ) {
    const clazz = target as unknown as new () => unknown;
    const on = DOn.create({
      botIds: options?.botIds,
      event: options?.event ?? key,
      once: false,
      rest: false,
    }).decorate(clazz.constructor, key, descriptor?.value);

    MetadataStorage.instance.addOn(on);
  };
}

/**
 * Handle discord rest events with a defined handler
 *
 * @param options - Rest event options
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/on#rest)
 *
 * @category Decorator
 */
On.rest = function (options?: RestEventOptions): MethodDecoratorEx {
  return function <T>(
    target: Record<string, T>,
    key: string,
    descriptor?: PropertyDescriptor
  ) {
    const clazz = target as unknown as new () => unknown;
    const on = DOn.create({
      botIds: options?.botIds,
      event: options?.event ?? key,
      once: false,
      rest: true,
    }).decorate(clazz.constructor, key, descriptor?.value);

    MetadataStorage.instance.addOn(on);
  };
};
