import "reflect-metadata";
import {
  MetadataStorage,
  DOption,
  OptionType,
  OptionValueType,
  OptionParams
} from "../..";

export function Option(name: string);
export function Option(name: string, type: OptionValueType | OptionType);
export function Option(name: string, params: OptionParams);
export function Option(name: string, type: OptionValueType | OptionType, params: OptionParams);
export function Option(
  name: string,
  typeOrParams?: OptionParams | OptionValueType | OptionType,
  params?: OptionParams
) {
  return (target: Object, key: string, index: number) => {
    const isParams = typeof typeOrParams === "object";
    let finalParams: OptionParams = params || {};
    let type = Reflect.getMetadata("design:paramtypes", target, key)[index] as OptionValueType;

    if (isParams) {
      finalParams = typeOrParams as OptionParams;
    } else if (typeOrParams !== undefined) {
      type = typeOrParams as OptionValueType;
    }

    const option = DOption.createOption(
      name || key,
      type,
      finalParams?.description,
      !!finalParams?.required,
      index
    ).decorate(
      target.constructor,
      key,
      target[key],
      target.constructor,
      index
    );

    MetadataStorage.instance.addOption(option);
  };
}
