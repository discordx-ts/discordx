import { MetadataStorage, GuardFunction, DGuard } from "../..";

export function Guard(...fns: GuardFunction[]) {
  return (
    target: Function | Object,
    key?: string,
    descriptor?: PropertyDescriptor
  ): void => {
    fns.map((fn) => {
      const guard = DGuard.createGuard(fn).decorateUnknown(
        target,
        key,
        descriptor
      );
      MetadataStorage.instance.addGuard(guard);
    });
  };
}
