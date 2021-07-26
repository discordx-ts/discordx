import { MetadataStorage, DiscordEvents, DOn } from "../..";
import { MethodDecoratorEx } from "../../types/public/decorators";
import { EventParams } from "../params/EventParams";

/**
 * Trigger a discord event
 * @param event The discord event to trigger
 */
export function On(event: DiscordEvents): MethodDecoratorEx;
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
