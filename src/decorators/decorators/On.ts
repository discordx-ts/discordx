import {
  DOn,
  DiscordEvents,
  EventParams,
  MetadataStorage,
  MethodDecoratorEx,
} from "../..";

/**
 * Trigger a discord event
 * @param event name of event
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/on)
 * @category Decorator
 */
export function On(event: DiscordEvents): MethodDecoratorEx;

/**
 * Trigger a discord event
 * @param event name of event
 * @param params addition configuration
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/on)
 * @category Decorator
 */
export function On(
  event: DiscordEvents,
  params?: EventParams
): MethodDecoratorEx;

export function On(
  event: DiscordEvents,
  params?: EventParams
): MethodDecoratorEx {
  return function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: Record<string, any>,
    key: string,
    descriptor?: PropertyDescriptor
  ) {
    const on = DOn.create(event, false, params?.botIds).decorate(
      target.constructor,
      key,
      descriptor?.value
    );

    MetadataStorage.instance.addOn(on);
  };
}
