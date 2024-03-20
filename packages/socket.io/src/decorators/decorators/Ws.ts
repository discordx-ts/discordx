/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { ClassDecoratorEx } from "@discordx/internal";

import { DWs, MetadataStorage } from "../../index.js";

export function Ws(options?: { appId?: string }): ClassDecoratorEx {
  return function (target: Record<string, any>) {
    const clazz = target as unknown as new () => unknown;
    const instance = DWs.create({
      appId: options?.appId,
    }).decorate(clazz, clazz.name);
    MetadataStorage.instance.adDWs(instance);
  };
}
