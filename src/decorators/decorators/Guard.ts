import {
  MetadataStorage,
  GuardFunction,
  DGuard
} from "../..";

export function Guard(...fns: GuardFunction[]) {
  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    fns.map((fn) => {
      const guard = (
        DGuard
        .createGuard(fn)
        .decorate(
          target.constructor,
          key,
          descriptor.value
        )
      );
      MetadataStorage.instance.addGuard(guard);
    });
  };
}
