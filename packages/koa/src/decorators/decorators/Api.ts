import type { ClassMethodDecorator } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import { DRouter, MetadataStorage } from "../../index.js";
import { DRequest } from "../index.js";

export function Api(name: string): ClassMethodDecorator {
  return function <T>(
    target: Record<string, T>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DRouter | DRequest>(
        (original) => {
          original.api = name;
        },
        DRouter,
        DRequest
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
