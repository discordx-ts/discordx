import type { ClassDecoratorEx } from "@discordx/internal";
import type KoaRouter from "@koa/router";

import { DRouter, MetadataStorage } from "../../index.js";

export function Router(options?: {
  description?: string;
  name?: string;
  options?: KoaRouter.RouterOptions;
}): ClassDecoratorEx {
  return function <T>(target: Record<string, T>) {
    const myClass = target as unknown as new () => unknown;
    const instance = DRouter.create({
      description: options?.description,
      name: options?.name ?? myClass.name,
      options: options?.options,
    }).decorate(myClass, myClass.name);
    MetadataStorage.instance.addRouter(instance);
  };
}
