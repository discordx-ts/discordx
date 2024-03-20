/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { ClassMethodDecorator } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import { DEvent, DWs, MetadataStorage } from "../../index.js";

export function AppId(id: string): ClassMethodDecorator {
  return function (
    target: Record<string, any>,
    key?: string,
    descriptor?: PropertyDescriptor,
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DEvent | DWs>(
        (original) => {
          original.appId = id;
        },
        DEvent,
        DWs,
      ).decorateUnknown(target, key, descriptor),
    );
  };
}
