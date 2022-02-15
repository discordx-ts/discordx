import type { ClassMethodDecorator } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type { GuardFunction } from "../../index.js";
import {
  DApplicationCommand,
  DComponent,
  DDiscord,
  DGuard,
  DOn,
  DSimpleCommand,
  MetadataStorage,
} from "../../index.js";
import type { Method } from "../classes/Method.js";

/**
 * Define guard aka middleware for your application command, simple command, events, select menu, button
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
        DComponent,
        DApplicationCommand,
        DSimpleCommand,
        DOn,
        DDiscord
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
