import {
  MetadataStorage,
  GuardFunction
} from "..";

export function Guard(...fns: GuardFunction[]) {
  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    fns.reverse().map((fn) => {
      MetadataStorage.instance.addGuard({
        class: target.constructor,
        key,
        params: {
          fn,
          method: descriptor.value
        }
      });
    });
  };
}
