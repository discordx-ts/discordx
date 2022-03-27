import type { MethodDecoratorEx } from "@discordx/internal";

import type { DiscordEvents, EventOptions } from "../../index.js";
import { DOn, MetadataStorage } from "../../index.js";

/**
 * Handle discord events once only with a defined handler
 *
 * @param event - Event name
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/once)
 *
 * @category Decorator
 */
export function Once(event: DiscordEvents): MethodDecoratorEx;

/**
 * Handle discord events once only with a defined handler
 *
 * @param event - Event name
 * @param options - Event parameters
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/once)
 *
 * @category Decorator
 */
export function Once(
  event: DiscordEvents,
  options?: EventOptions
): MethodDecoratorEx;

export function Once(
  event: DiscordEvents,
  options?: EventOptions
): MethodDecoratorEx {
  return function <T>(
    target: Record<string, T>,
    key: string,
    descriptor: PropertyDescriptor
  ) {
    const clazz = target as unknown as new () => unknown;
    const on = DOn.create(event, true, options?.botIds).decorate(
      clazz.constructor,
      key,
      descriptor.value
    );

    MetadataStorage.instance.addOn(on);
  };
}
