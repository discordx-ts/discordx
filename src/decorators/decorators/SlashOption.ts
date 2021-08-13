import "reflect-metadata";
import {
  MetadataStorage,
  DApplicationCommandOption,
  OptionParams,
  Modifier,
  StringOptionType,
} from "../..";
import { ParameterDecoratorEx } from "../../types/public/decorators";
import { DApplicationCommand } from "../classes/DApplicationCommand";

export function SlashOption(name?: string): ParameterDecoratorEx;
export function SlashOption(
  name: string,
  params?: OptionParams
): ParameterDecoratorEx;
export function SlashOption(
  name: string,
  params: OptionParams
): ParameterDecoratorEx;
export function SlashOption(name?: string, params?: OptionParams) {
  return (target: Record<string, any>, key: string, index: number) => {
    const type: StringOptionType =
      params?.type ??
      // eslint-disable-next-line @typescript-eslint/ban-types
      ((Reflect.getMetadata("design:paramtypes", target, key) as any[])[
        index
      ] as StringOptionType);

    const option = DApplicationCommandOption.create(
      name ?? key,
      type,
      params?.description,
      params?.required,
      index
    ).decorate(target.constructor, key, target[key], target.constructor, index);

    option.isNode = true;

    MetadataStorage.instance.addModifier(
      Modifier.create<DApplicationCommand>((original) => {
        original.slashOptions = [...original.slashOptions, option];
      }, DApplicationCommand).decorate(
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
