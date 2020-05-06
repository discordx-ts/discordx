import {
  MetadataStorage,
  DiscordEvents
} from "..";

export function Once(event: DiscordEvents);
export function Once(event: string);
export function Once(event: DiscordEvents) {
  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    MetadataStorage.Instance.AddOn({
      class: target.constructor,
      key,
      params: {
        from: target.constructor,
        guards: [],
        event,
        once: true,
        method: descriptor.value,
        originalParams: {}
      }
    });
  };
}
