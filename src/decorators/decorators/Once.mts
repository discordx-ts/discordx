import {
  DOn,
  DiscordEvents,
  EventParams,
  MetadataStorage,
  MethodDecoratorEx,
} from "../../index.mjs";

/**
 * Trigger a discord event, It's exactly the same behavior as @On but the method is only executed once
 * @param event name of event
 * ___
 * [View Documentation](https://discord-ts.mjs.org/docs/decorators/general/once)
 * @category Decorator
 */
export function Once(event: DiscordEvents): MethodDecoratorEx;

/**
 * Trigger a discord event, It's exactly the same behavior as @On but the method is only executed once
 * @param event name of event
 * @param params addition configuration
 * ___
 * [View Documentation](https://discord-ts.mjs.org/docs/decorators/general/once)
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
