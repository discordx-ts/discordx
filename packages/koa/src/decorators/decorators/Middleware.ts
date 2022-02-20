import type { ClassMethodDecorator } from "@discordx/internal";
import { Modifier } from "@discordx/internal";
import type KoaRouter from "@koa/router";

import { DRequest, DRouter, MetadataStorage } from "../../index.js";

export function Middleware(
  ...middleware: KoaRouter.Middleware[]
): ClassMethodDecorator {
  return function <T>(
    target: Record<string, T>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DRouter | DRequest>(
        (original) => {
          if (original instanceof DRouter) {
            original.router.use(...middleware);
          } else {
            original.middlewares = [...original.middlewares, ...middleware];
          }
        },
        DRouter,
        DRequest
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
