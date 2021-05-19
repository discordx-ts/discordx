import { MetadataStorage, GuardFunction, DGuard, Modifier, Method } from "../..";
import { DDiscord } from "../classes/DDiscord";
import { DOn } from "../classes/DOn";
import { DSlash } from "../classes/DSlash";

export function Guard(...fns: GuardFunction[]) {
  return (
    target: Function | Object,
    key?: string,
    descriptor?: PropertyDescriptor
  ): void => {
    const guards = fns.map((fn) => {
      return DGuard.create(fn).decorateUnknown(
        target,
        key,
        descriptor
      );
    });

    MetadataStorage.instance.addModifier(
      Modifier.create<Method>(async (original) => {
        original.guards = guards;
      }, DSlash, DOn, DDiscord).decorateUnknown(target, key, descriptor)
    );
  };
}
