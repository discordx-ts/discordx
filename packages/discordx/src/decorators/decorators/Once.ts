import type { MethodDecoratorEx } from "@discordx/internal";

import type { DiscordEvents, EventParams } from "../../index.js";
import { DOn, MetadataStorage } from "../../index.js";

/**
 * Trigger a discord event, It's exactly the same behavior as @On but the method is only executed once
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/once)
 * @category Decorator
 */
export function Once(event: DiscordEvents): MethodDecoratorEx;
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
