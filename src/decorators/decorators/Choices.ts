import { MetadataStorage, DChoice, DOption, Modifier, ChoicesType } from "../..";

export function Choices(choices: ChoicesType);
export function Choices(choices: ChoicesType) {
  return (target: Object, key: string, index: number) => {
    MetadataStorage.instance.addModifier(
      Modifier.create<DOption>((original) => {
        const arrayChoices = Object.keys(choices).map((key) => {
          return DChoice.create(key, choices[key]);
        });
        original.choices = [
          ...original.choices,
          ...arrayChoices,
        ];
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
