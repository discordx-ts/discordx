import { MetadataStorage, DChoice, DOption, Modifier } from "../..";
import { ParameterDecoratorEx } from "../../types/public/decorators";

export function SlashChoice(name: string, value: number): ParameterDecoratorEx;
export function SlashChoice(name: string, value: string): ParameterDecoratorEx;
export function SlashChoice(name: string, value: string | number) {
  return (target: Record<string, any>, key: string, index: number) => {
    MetadataStorage.instance.addModifier(
      Modifier.create<DOption>((original) => {
        original.choices = [...original.choices, DChoice.create(name, value)];
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
