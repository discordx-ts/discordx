import type { ParameterDecoratorEx } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type { SlashChoiceType } from "../../index.js";
import {
  DApplicationCommandOption,
  DApplicationCommandOptionChoice,
  MetadataStorage,
} from "../../index.js";
import type { NotEmpty } from "../../types/index.js";

/**
 * The slash command option can implement autocompletion for string and number types
 *
 * @param choices - choices
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/slash-choice)
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
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/slash-choice)
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
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/slash-choice)
 *
 * @category Decorator
 */
export function SlashChoice<T extends string, X = string | number>(
  ...choices: SlashChoiceType<T, X>[]
): ParameterDecoratorEx;

export function SlashChoice(
  ...choices: (number | string | SlashChoiceType)[]
): ParameterDecoratorEx {
  return function <T>(target: Record<string, T>, key: string, index: number) {
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
        index
      )
    );
  };
}
