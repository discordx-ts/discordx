import { MetadataStorage, DiscordEvents, DOn } from "../..";
import { EventParams } from "../params/EventParams";

/**
 * Trigger a discord event only once
 * @link https://github.com/OwenCalvin/discord.ts#client-payload-injection
 * @param event The discord event to trigger
 */
export function Once(event: DiscordEvents);
export function Once(event: DiscordEvents, params?: EventParams);
export function Once(event: DiscordEvents, params?: EventParams) {
  return (
    target: Object,
    key: string,
    descriptor: PropertyDescriptor
  ): void => {
    const on = DOn.create(event, true, params?.botIds ?? []).decorate(
      target.constructor,
      key,
      descriptor.value
    );

    MetadataStorage.instance.addOn(on);
  };
}
