import {
  MetadataStorage,
  DApplicationCommandOptionChoice,
  DApplicationCommandOption,
  Modifier,
  ChoicesType,
} from "../..";
import { ParameterDecoratorEx } from "../../types/public/decorators";

/**
 * An option of a Slash command can implement an autocompletion feature for ``string`` and ``number`` types
 * @param name string
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/slashchoice)
 */
export function SlashChoice(name: string): ParameterDecoratorEx;

/**
 * An option of a Slash command can implement an autocompletion feature for ``string`` and ``number`` types
 * @param name number
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/slashchoice)
 */
export function SlashChoice(name: number): ParameterDecoratorEx;

/**
 * An option of a Slash command can implement an autocompletion feature for ``string`` and ``number`` types
 * @param name string
 * @param value number
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/slashchoice)
 */
export function SlashChoice(name: string, value: number): ParameterDecoratorEx;

/**
 * An option of a Slash command can implement an autocompletion feature for ``string`` and ``number`` types
 * @param name string
 * @param value string
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/slashchoice)
 */
export function SlashChoice(name: string, value: string): ParameterDecoratorEx;

/**
 * An option of a Slash command can implement an autocompletion feature for ``string`` and ``number`` types
 * @param choices array/object of choices
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/slashchoice)
 */
export function SlashChoice(choices: ChoicesType): ParameterDecoratorEx;

export function SlashChoice(
  name: string | ChoicesType | number,
  value?: string | number
) {
  return (target: Record<string, any>, key: string, index: number) => {
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
          const allChoices = Object.keys(name).map((key) => {
            return DApplicationCommandOptionChoice.create(key, name[key]);
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
