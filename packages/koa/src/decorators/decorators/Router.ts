/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { ClassDecoratorEx } from "@discordx/internal";
import type KoaRouter from "@koa/router";

import { DRouter, MetadataStorage } from "../../index.js";

export function Router(options?: {
  description?: string;
  name?: string;
  options?: KoaRouter.RouterOptions;
}): ClassDecoratorEx {
  return function (target: Record<string, any>) {
    const clazz = target as unknown as new () => unknown;
    const instance = DRouter.create({
      description: options?.description,
      name: options?.name ?? clazz.name,
      options: options?.options,
    }).decorate(clazz, clazz.name);
    MetadataStorage.instance.addRouter(instance);
  };
}
