import { MetadataStorage, DiscordEvents, DOn } from "../..";
import { MethodDecoratorEx } from "../../types/public/decorators";
import { EventParams } from "../params/EventParams";

/**
 * Trigger a discord event
 * @param event name of event
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/on)
 */
export function On(event: DiscordEvents): MethodDecoratorEx;

/**
 * Trigger a discord event
 * @param event name of event
 * @param params addition configuration
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/on)
 */
export function On(
  event: DiscordEvents,
  params?: EventParams
): MethodDecoratorEx;

export function On(event: DiscordEvents, params?: EventParams) {
  return function (
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
