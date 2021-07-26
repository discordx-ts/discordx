import { MetadataStorage, DiscordEvents, DOn } from "../..";
import { MethodDecoratorEx } from "../../types/public/decorators";
import { EventParams } from "../params/EventParams";

/**
 * Trigger a discord event only once
 * @param event The discord event to trigger
 */
export function Once(event: DiscordEvents): MethodDecoratorEx;
export function Once(
  event: DiscordEvents,
  params?: EventParams
): MethodDecoratorEx;
export function Once(event: DiscordEvents, params?: EventParams) {
  return function (
    target: Record<string, any>,
    key: string,
    descriptor: PropertyDescriptor
  ) {
    const on = DOn.create(event, true, params?.botIds).decorate(
      target.constructor,
      key,
      descriptor.value
    );

    MetadataStorage.instance.addOn(on);
  };
}
