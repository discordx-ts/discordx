import { MetadataStorage, DChoice, DOption, Modifier } from "../..";

export function Choice(name: string, value: number);
export function Choice(name: string, value: string);
export function Choice(name: string, value: string | number) {
  return (target: Object, key: string, index: number) => {
    MetadataStorage.instance.addModifier(
      Modifier.create<DOption>(async (original) => {
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
