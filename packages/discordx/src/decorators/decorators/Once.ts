import type { MethodDecoratorEx } from "@discordx/internal";

import type { EventOptions, RestEventOptions } from "../../index.js";
import { DOn, MetadataStorage } from "../../index.js";

/**
 * Handle discord events once only with a defined handler
 * ___
 *
 * [View Documentation](https://discordx.js.orgdocs/packages/discordx/guides/decorators/general/once)
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
 * [View Documentation](https://discordx.js.orgdocs/packages/discordx/guides/decorators/general/once)
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
 * [View Documentation](https://discordx.js.orgdocs/packages/discordx/guides/decorators/general/once)
 *
 * @category Decorator
 */
export function Once(options?: EventOptions): MethodDecoratorEx {
  return function <T>(
    target: Record<string, T>,
    key: string,
    descriptor: PropertyDescriptor
  ) {
    const clazz = target as unknown as new () => unknown;
    const on = DOn.create({
      botIds: options?.botIds,
      event: options?.event ?? key,
      once: true,
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
 * [View Documentation](https://discordx.js.orgdocs/packages/discordx/guides/decorators/general/once#rest)
 *
 * @category Decorator
 */
Once.rest = function (options?: RestEventOptions): MethodDecoratorEx {
  return function <T>(
    target: Record<string, T>,
    key: string,
    descriptor?: PropertyDescriptor
  ) {
    const clazz = target as unknown as new () => unknown;
    const on = DOn.create({
      botIds: options?.botIds,
      event: options?.event ?? key,
      once: true,
      rest: true,
    }).decorate(clazz.constructor, key, descriptor?.value);

    MetadataStorage.instance.addOn(on);
  };
};
