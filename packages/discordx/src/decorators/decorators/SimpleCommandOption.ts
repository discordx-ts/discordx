/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { ParameterDecoratorEx } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type { SimpleCommandOptionOptions } from "../../index.js";
import {
  DSimpleCommand,
  DSimpleCommandOption,
  MetadataStorage,
} from "../../index.js";

/**
 * Add a simple command option
 *
 * @param options - Command option options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/simple-command-option)
 *
 * @category Decorator
 */
export function SimpleCommandOption<T extends string>(
  options: SimpleCommandOptionOptions<T>,
): ParameterDecoratorEx {
  return function (target: Record<string, any>, key: string, index: number) {
    const option = DSimpleCommandOption.create(options).decorate(
      target.constructor,
      key,
      target[key],
      target.constructor,
      index,
    );

    MetadataStorage.instance.addModifier(
      Modifier.create<DSimpleCommand>((original) => {
        original.options = [...original.options, option];
      }, DSimpleCommand).decorate(
        target.constructor,
        key,
        target[key],
        target.constructor,
        index,
      ),
    );

    MetadataStorage.instance.addSimpleCommandOption(option);
  };
}
