import {
  MetadataStorage,
  DApplicationCommandOptionChoice,
  DApplicationCommandOption,
  Modifier,
  ChoicesType,
} from "../..";
import { ParameterDecoratorEx } from "../../types/public/decorators";

export function SlashChoice(name: string): ParameterDecoratorEx;
export function SlashChoice(name: number): ParameterDecoratorEx;
export function SlashChoice(name: string, value: number): ParameterDecoratorEx;
export function SlashChoice(name: string, value: string): ParameterDecoratorEx;
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
