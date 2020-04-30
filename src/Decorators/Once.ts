import {
  MetadataStorage,
  DiscordEvent
} from "..";

export function Once(event: DiscordEvent);
export function Once(event: string);
export function Once(event: DiscordEvent) {
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
