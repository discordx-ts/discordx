/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { Modifier, type ParameterDecoratorEx } from "@discordx/internal";

import {
  DApplicationCommandOption,
  DApplicationCommandOptionChoice,
  MetadataStorage,
  type SlashChoiceType,
} from "../../index.js";
import type { NotEmpty } from "../../types/index.js";

/**
 * The slash command option can implement autocompletion for string and number types
 *
 * @param choices - choices
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/slash-choice)
 *
 * @category Decorator
 */
export function SlashChoice<T extends string>(
  ...choices: NotEmpty<T>[]
): ParameterDecoratorEx;

/**
 * The slash command option can implement autocompletion for string and number types
 *
 * @param choices - choices
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/slash-choice)
 *
 * @category Decorator
 */
export function SlashChoice(...choices: number[]): ParameterDecoratorEx;

/**
 * The slash command option can implement autocompletion for string and number types
 *
 * @param choices - choices
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/slash-choice)
 *
 * @category Decorator
 */
export function SlashChoice<T extends string, X = string | number>(
  ...choices: SlashChoiceType<T, X>[]
): ParameterDecoratorEx;

/**
 * The slash command option can implement autocompletion for string and number types
 *
 * @param choices - choices
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/slash-choice)
 *
 * @category Decorator
 */
export function SlashChoice(
  ...choices: (number | string | SlashChoiceType)[]
): ParameterDecoratorEx {
  return function (target: Record<string, any>, key: string, index: number) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DApplicationCommandOption>((original) => {
        const allChoices = choices.map((choice) => {
          const resolveChoice =
            typeof choice === "number"
              ? { name: choice.toString(), value: choice }
              : typeof choice === "string"
                ? { name: choice, value: choice }
                : choice;

          return DApplicationCommandOptionChoice.create(resolveChoice);
        });

        original.choices = [...allChoices, ...original.choices];
      }, DApplicationCommandOption).decorate(
        target.constructor,
        key,
        target[key],
        target.constructor,
        index,
      ),
    );
  };
}
