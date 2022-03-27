import type { ClassDecoratorEx } from "@discordx/internal";

import { DWs, MetadataStorage } from "../../index.js";

export function Ws(options?: { appId?: string }): ClassDecoratorEx {
  return function <T>(target: Record<string, T>) {
    const clazz = target as unknown as new () => unknown;
    const instance = DWs.create({
      appId: options?.appId,
    }).decorate(clazz, clazz.name);
    MetadataStorage.instance.adDWs(instance);
  };
}
