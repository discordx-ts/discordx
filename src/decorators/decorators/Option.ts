import "reflect-metadata";
import {
  MetadataStorage,
  DOption,
  OptionParams,
  Modifier,
  StringOptionType,
} from "../..";
import { ParameterDecoratorEx } from "../../types/public/decorators";
import { DSlash } from "../classes/DSlash";

export function Option(name: string): ParameterDecoratorEx;
export function Option(
  name: string,
  params: OptionParams
): ParameterDecoratorEx;
export function Option(name: string, params?: OptionParams) {
  return (target: Record<string, any>, key: string, index: number) => {
    const type: StringOptionType =
      params?.type ??
      // eslint-disable-next-line @typescript-eslint/ban-types
      ((Reflect.getMetadata("design:paramtypes", target, key) as any[])[
        index
      ] as StringOptionType);

    const option = DOption.create(
      name ?? key,
      type,
      params?.description,
      params?.required,
      index
    ).decorate(target.constructor, key, target[key], target.constructor, index);

    option.isNode = true;

    MetadataStorage.instance.addModifier(
      Modifier.create<DSlash>((original) => {
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
