import {
  DApplicationCommandOption,
  DApplicationCommandOptionChoice,
  MetadataStorage,
  Modifier,
  ParameterDecoratorEx,
  SlashChoicesType,
} from "../../index.mjs";

/**
 * An option of a Slash command can implement an autocompletion feature for ``string`` and ``number`` types
 * @param name string
 * ___
 * [View Documentation](https://discord-ts.mjs.org/docs/decorators/commands/slashchoice)
 * @category Decorator
 */
export function SlashChoice(name: string): ParameterDecoratorEx;

/**
 * An option of a Slash command can implement an autocompletion feature for ``string`` and ``number`` types
 * @param name number
 * ___
 * [View Documentation](https://discord-ts.mjs.org/docs/decorators/commands/slashchoice)
 * @category Decorator
 */
export function SlashChoice(name: number): ParameterDecoratorEx;

/**
 * An option of a Slash command can implement an autocompletion feature for ``string`` and ``number`` types
 * @param name string
 * @param value number
 * ___
 * [View Documentation](https://discord-ts.mjs.org/docs/decorators/commands/slashchoice)
 * @category Decorator
 */
export function SlashChoice(name: string, value: number): ParameterDecoratorEx;

/**
 * An option of a Slash command can implement an autocompletion feature for ``string`` and ``number`` types
 * @param name string
 * @param value string
 * ___
 * [View Documentation](https://discord-ts.mjs.org/docs/decorators/commands/slashchoice)
 * @category Decorator
 */
export function SlashChoice(name: string, value: string): ParameterDecoratorEx;

/**
 * An option of a Slash command can implement an autocompletion feature for ``string`` and ``number`` types
 * @param choices array/object of choices
 * ___
 * [View Documentation](https://discord-ts.mjs.org/docs/decorators/commands/slashchoice)
 * @category Decorator
 */
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
