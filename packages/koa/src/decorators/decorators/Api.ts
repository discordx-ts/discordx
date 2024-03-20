/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { ClassMethodDecorator } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import { DRouter, MetadataStorage } from "../../index.js";
import { DRequest } from "../index.js";

export function Api(name: string): ClassMethodDecorator {
  return function (
    target: Record<string, any>,
    key?: string,
    descriptor?: PropertyDescriptor,
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DRouter | DRequest>(
        (original) => {
          original.api = name;
        },
        DRouter,
        DRequest,
      ).decorateUnknown(target, key, descriptor),
    );
  };
}
