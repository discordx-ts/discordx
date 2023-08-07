import type { ClassMethodDecorator } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type { GuardFunction } from "../../index.js";
import { DEvent, DGuard, DWs, MetadataStorage } from "../../index.js";
import type { Method } from "../classes/Method.js";

export function Guard<Type = any>(
  ...fns: GuardFunction<Type>[]
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
        DEvent,
        DWs,
      ).decorateUnknown(target, key, descriptor),
    );
  };
}
