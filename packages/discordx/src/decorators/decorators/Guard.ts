import { ClassMethodDecorator, Modifier } from "@discordx/internal";
import {
  DApplicationCommand,
  DComponentButton,
  DComponentSelectMenu,
  DDiscord,
  DGuard,
  DOn,
  DSimpleCommand,
  GuardFunction,
  MetadataStorage,
} from "../../index.js";
import { Method } from "../classes/Method.js";

/**
 * Define guard aka middleware for your application command, simple command, events, select menu, button
 * @param fns array of guards
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/guard)
 * @category Decorator
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Guard<Type = any, DatasType = any>(
  ...fns: GuardFunction<Type, DatasType>[]
): ClassMethodDecorator {
  return function <T>(
    target: Record<string, T>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    const guards = fns.map((fn) => {
      return DGuard.create(fn as () => unknown).decorateUnknown(
        target,
        key,
        descriptor
      );
    });

    MetadataStorage.instance.addModifier(
      Modifier.create<Method>(
        (original) => {
          original.guards = guards;
        },
        DComponentSelectMenu,
        DComponentButton,
        DApplicationCommand,
        DSimpleCommand,
        DOn,
        DDiscord
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
