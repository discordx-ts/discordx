import type { ParameterDecoratorEx } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type { NotEmpty, SlashChoicesType } from "../../index.js";
import {
  DApplicationCommandOption,
  DApplicationCommandOptionChoice,
  MetadataStorage,
} from "../../index.js";

/**
 * The slash command option can implement autocompletion for string and number types
 *
 * @param name Choice name/value
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/slashchoice)
 *
 * @category Decorator
 */
export function SlashChoice<T extends string>(
  name: NotEmpty<T>
): ParameterDecoratorEx;

/**
 * The slash command option can implement autocompletion for string and number types
 *
 * @param name Choice name/value
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/slashchoice)
 *
 * @category Decorator
 */
export function SlashChoice(name: number): ParameterDecoratorEx;

/**
 * The slash command option can implement autocompletion for string and number types
 *
 * @param name Choice name
 * @param value Choice value
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/slashchoice)
 *
 * @category Decorator
 */
export function SlashChoice<T extends string>(
  name: NotEmpty<T>,
  value: number
): ParameterDecoratorEx;

/**
 * The slash command option can implement autocompletion for string and number types
 *
 * @param name Choice name
 * @param value Choice value
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/slashchoice)
 *
 * @category Decorator
 */
export function SlashChoice<T extends string, V extends string>(
  name: NotEmpty<T>,
  value: NotEmpty<V>
): ParameterDecoratorEx;
export function SlashChoice(choices: SlashChoicesType): ParameterDecoratorEx;

export function SlashChoice(
  name: string | SlashChoicesType | number,
  value?: string | number
): ParameterDecoratorEx {
  return function <T>(target: Record<string, T>, key: string, index: number) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DApplicationCommandOption>((original) => {
        if (typeof name === "string" || typeof name === "number") {
          original.choices = [
            ...original.choices,
            DApplicationCommandOptionChoice.create(
              name.toString(),
              value ? value : name
            ),
          ];
        } else {
          const allChoices = Object.keys(name).map((subKey) => {
            return DApplicationCommandOptionChoice.create(
              subKey,
              name[subKey] ?? "undefined"
            );
          });
          original.choices = [...original.choices, ...allChoices];
        }
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
