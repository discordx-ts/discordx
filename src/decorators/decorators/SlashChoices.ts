import {
  MetadataStorage,
  DChoice,
  DOption,
  Modifier,
  ChoicesType,
} from "../..";
import { ParameterDecoratorEx } from "../../types/public/decorators";

export function SlashChoices(choices: ChoicesType): ParameterDecoratorEx;
export function SlashChoices(choices: ChoicesType) {
  return function (target: Record<string, any>, key: string, index: number) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DOption>((original) => {
        const arrayChoices = Object.keys(choices).map((key) => {
          return DChoice.create(key, choices[key]);
        });
        original.choices = [...original.choices, ...arrayChoices];
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
