import "reflect-metadata";
import {
  MetadataStorage,
  DOption,
  OptionValueType,
  OptionParams,
  Modifier,
} from "../..";
import { DSlash } from "../classes/DSlash";

export function Option(name: string);
export function Option(name: string, params: OptionParams);
export function Option(name: string, params?: OptionParams) {
  return (target: Object, key: string, index: number) => {
    const type =
      params?.type ??
      (Reflect.getMetadata("design:paramtypes", target, key)[
        index
      ] as OptionValueType);

    const option = DOption.create(
      name || key,
      type,
      params?.description,
      params?.required,
      index
    ).decorate(target.constructor, key, target[key], target.constructor, index);

    option.isNode = true;

    MetadataStorage.instance.addModifier(
      Modifier.create<DSlash>(async (original) => {
        original.options = [...original.options, option];
      }, DSlash).decorate(
        target.constructor,
        key,
        target[key],
        target.constructor,
        index
      )
    );

    MetadataStorage.instance.addOption(option);
  };
}
