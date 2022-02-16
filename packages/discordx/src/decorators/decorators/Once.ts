import type { MethodDecoratorEx } from "@discordx/internal";

import type { DiscordEvents, EventParams } from "../../index.js";
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
 * @param params - Event parameters
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/once)
 *
 * @category Decorator
 */
export function Once(
  event: DiscordEvents,
  params?: EventParams
): MethodDecoratorEx;

export function Once(
  event: DiscordEvents,
  params?: EventParams
): MethodDecoratorEx {
  return function <T>(
    target: Record<string, T>,
    key: string,
    descriptor: PropertyDescriptor
  ) {
    const myClass = target as unknown as new () => unknown;
    const on = DOn.create(event, true, params?.botIds).decorate(
      myClass.constructor,
      key,
      descriptor.value
    );

    MetadataStorage.instance.addOn(on);
  };
}
