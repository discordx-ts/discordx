import {
  MetadataStorage,
  DChoice,
  DOption,
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
      Modifier.create<DOption>((original) => {
        if (typeof name === "string" || typeof name === "number") {
          original.choices = [
            ...original.choices,
            DChoice.create(name.toString(), value ? value : name),
          ];
        } else {
          const allChoices = Object.keys(name).map((key) => {
            return DChoice.create(key, name[key]);
          });
          original.choices = [...original.choices, ...allChoices];
        }
      }, DOption).decorate(
        target.constructor,
        key,
        target[key],
        target.constructor,
        index
      )
    );
  };
}
