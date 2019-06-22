import {
  MetadataStorage,
  DiscordEvent
} from "..";

export function Once(event: DiscordEvent);
export function Once(event: string);
export function Once(event: DiscordEvent | string) {
  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    MetadataStorage.Instance.AddOn({
      class: target.constructor,
      key,
      params: {
        event,
        once: true,
        method: descriptor.value
      }
    });
  };
}
