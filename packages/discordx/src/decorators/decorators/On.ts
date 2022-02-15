import type { MethodDecoratorEx } from "@discordx/internal";

import type { DiscordEvents, EventParams } from "../../index.js";
import { DOn, MetadataStorage } from "../../index.js";

/**
 * Trigger a discord event
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/on)
 * @category Decorator
 */
export function On(event: DiscordEvents): MethodDecoratorEx;
export function On(
  event: DiscordEvents,
  params?: EventParams
): MethodDecoratorEx;

export function On(
  event: DiscordEvents,
  params?: EventParams
): MethodDecoratorEx {
  return function <T>(
    target: Record<string, T>,
    key: string,
    descriptor?: PropertyDescriptor
  ) {
    const myClass = target as unknown as new () => unknown;
    const on = DOn.create(event, false, params?.botIds).decorate(
      myClass.constructor,
      key,
      descriptor?.value
    );

    MetadataStorage.instance.addOn(on);
  };
}
