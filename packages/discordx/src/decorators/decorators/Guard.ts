import type { ClassMethodDecorator } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type { GuardFunction } from "../../index.js";
import {
  DApplicationCommand,
  DComponent,
  DDiscord,
  DGuard,
  DOn,
  DReaction,
  DSimpleCommand,
  MetadataStorage,
} from "../../index.js";
import type { Method } from "../classes/Method.js";

/**
 * Define middleware for buttons, events, select menus, simple commands, slashes, etc.
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/guard)
 *
 * @category Decorator
 */
export function Guard<Type = any, DataType = any>(
  ...fns: GuardFunction<Type, DataType>[]
): ClassMethodDecorator {
  return function (
    target: Record<string, any>,
    key?: string,
    descriptor?: PropertyDescriptor,
  ) {
    const guards = fns.map((fn) => {
      return DGuard.create(fn as () => unknown).decorateUnknown(
        target,
        key,
        descriptor,
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
        DDiscord,
        DReaction,
      ).decorateUnknown(target, key, descriptor),
    );
  };
}
