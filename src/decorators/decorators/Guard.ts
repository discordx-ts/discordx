import {
  MetadataStorage,
  GuardFunction,
  DGuard,
  Modifier,
  Method,
} from "../..";
import { DButton } from "../classes/DButton";
import { DDiscord } from "../classes/DDiscord";
import { DOn } from "../classes/DOn";
import { DSelectMenu } from "../classes/DSelectMenu";
import { DSlash } from "../classes/DSlash";

export function Guard<Type = any, DatasType = any>(
  ...fns: GuardFunction<Type, DatasType>[]
) {
  return (
    target: Function | Object,
    key?: string,
    descriptor?: PropertyDescriptor
  ): void => {
    const guards = fns.map((fn) => {
      return DGuard.create(fn).decorateUnknown(target, key, descriptor);
    });

    MetadataStorage.instance.addModifier(
      Modifier.create<Method>(
        (original) => {
          original.guards = guards;
        },
        DSelectMenu,
        DButton,
        DSlash,
        DOn,
        DDiscord
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
