import {
  MetadataStorage,
  DiscordEvents,
  DOn
} from "../..";

/**
 * Trigger a discord event only once
 * @link https://github.com/OwenCalvin/discord.ts#client-payload-injection
 * @param event The discord event to trigger
 */
export function Once(event: DiscordEvents) {
  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    const on = (
      DOn
      .createOn(
        event,
        true
      )
      .decorate(
        target.constructor,
        key,
        descriptor.value
      )
    );

    MetadataStorage.instance.addOn(on);
  };
}
