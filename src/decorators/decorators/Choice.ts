import { MetadataStorage, DChoice, DOption, Modifier } from "../..";

export function Choice(name: string, value: number)
export function Choice(name: string, value: string)
export function Choice(name: string, value: string | number) {
  return async (
    target: Object,
    key: string,
    index: number
  ) => {
    MetadataStorage.instance.addModifier(
      Modifier.createModifier<DOption>(async (original) => {
        original.choices = [
          ...original.choices,
          DChoice.createChoice(name, value)
        ];
      }).decorateUnknown(target, key, undefined, index)
    );
  };
}
