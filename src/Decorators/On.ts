import {
  MetadataStorage,
  DiscordEvent
} from "..";

export function On(event: DiscordEvent);
export function On(event: string);
export function On(event: DiscordEvent | string) {
  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    MetadataStorage.Instance.AddOn({
      class: target.constructor,
      key,
      params: {
        guards: [],
        event,
        once: false,
        method: descriptor.value
      }
    });
  };
}
