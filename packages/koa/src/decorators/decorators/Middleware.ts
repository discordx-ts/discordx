/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { ClassMethodDecorator } from "@discordx/internal";
import { Modifier } from "@discordx/internal";
import type KoaRouter from "@koa/router";

import { DRequest, DRouter, MetadataStorage } from "../../index.js";

export function Middleware(
  ...middleware: KoaRouter.Middleware[]
): ClassMethodDecorator {
  return function (
    target: Record<string, any>,
    key?: string,
    descriptor?: PropertyDescriptor,
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DRouter | DRequest>(
        (original) => {
          if (original instanceof DRouter) {
            original.router.use(...middleware);
          } else {
            original.middleware = [...original.middleware, ...middleware];
          }
        },
        DRouter,
        DRequest,
      ).decorateUnknown(target, key, descriptor),
    );
  };
}
