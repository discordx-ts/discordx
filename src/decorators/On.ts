import {
  MetadataStorage,
  DiscordEvents
} from "..";

export function On(event: DiscordEvents) {
  return (target: Object, key: string, descriptor?: PropertyDescriptor): void => {
    MetadataStorage.Instance.AddOn({
      class: target.constructor,
      key,
      params: {
        from: target.constructor,
        guards: [],
        event,
        once: false,
        method: descriptor.value,
        originalParams: {}
      }
    });
  };
}
