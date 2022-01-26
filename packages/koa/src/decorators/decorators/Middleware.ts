import type { ClassMethodDecorator } from "@discordx/internal";
import { Modifier } from "@discordx/internal";
import type KoaRouter from "@koa/router";

import { DReqeuest, DRouter, MetadataStorage } from "../../index.js";

export function Middleware(
  ...midddleware: KoaRouter.Middleware[]
): ClassMethodDecorator {
  return function <T>(
    target: Record<string, T>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DRouter | DReqeuest>(
        (original) => {
          if (original instanceof DRouter) {
            original.router.use(...midddleware);
          } else {
            original.middlewares = [...original.middlewares, ...midddleware];
          }
        },
        DRouter,
        DReqeuest
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
