/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { ClassDecoratorEx } from "@discordx/internal";

import { DDiscord, MetadataStorage } from "../../index.js";

/**
 * Create a metadata instance for the class
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/general/discord)
 *
 * @category Decorator
 */
export function Discord(): ClassDecoratorEx {
  return function (target: Record<string, any>) {
    const clazz = target as unknown as new () => unknown;
    const instance = DDiscord.create(clazz.name).decorate(clazz, clazz.name);
    MetadataStorage.instance.addDiscord(instance);
  };
}
