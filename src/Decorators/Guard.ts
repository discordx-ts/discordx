import {
  MetadataStorage,
  GuardFunction
} from "..";

export function Guard(fn: GuardFunction) {
  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    MetadataStorage.Instance.AddGuard({
      class: target.constructor,
      key,
      params: {
        fn,
        method: descriptor.value
      }
    });
  };
}
