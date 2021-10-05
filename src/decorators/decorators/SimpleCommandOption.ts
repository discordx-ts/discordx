/* eslint-disable @typescript-eslint/ban-types */
import {
  DSimpleCommand,
  DSimpleCommandOption,
  MetadataStorage,
  Modifier,
  ParameterDecoratorEx,
  SimpleCommandType,
  SimpleCommandTypes,
  VerifyName,
} from "../..";

/**
 * Define option for simple commnad
 * @param name option name
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/simplecommandoption)
 * @category Decorator
 */
export function SimpleCommandOption<T extends string>(
  name: VerifyName<T>
): ParameterDecoratorEx;

/**
 * Define option for simple commnad
 * @param name option name
 * @param params additional configuration
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/simplecommandoption)
 * @category Decorator
 */
export function SimpleCommandOption<T extends string>(
  name: VerifyName<T>,
  params?: { description?: string; type?: SimpleCommandType }
): ParameterDecoratorEx;

export function SimpleCommandOption(
  name: string,
  params?: { description?: string; type?: SimpleCommandType }
): ParameterDecoratorEx {
  return function <T>(target: Record<string, T>, key: string, index: number) {
    const dType = (
      Reflect.getMetadata("design:paramtypes", target, key)[index] as Function
    ).name.toUpperCase();

    const type: SimpleCommandType =
      params?.type ??
      (dType === "GUILDMEMBER"
        ? "USER"
        : dType === "TEXTCHANNEL" || dType === "VOICECHANNEL"
        ? "CHANNEL"
        : (dType as SimpleCommandType));

    // throw error if option type is invalid
    if (!SimpleCommandTypes.includes(type)) {
      throw Error(
        `invalid simple command option: ${type}\nSupported types are: ${SimpleCommandTypes.join(
          ", "
        )}`
      );
    }

    const option = DSimpleCommandOption.create(
      name,
      type,
      params?.description
    ).decorate(target.constructor, key, target[key], target.constructor, index);

    MetadataStorage.instance.addModifier(
      Modifier.create<DSimpleCommand>((original) => {
        original.options = [...original.options, option];
      }, DSimpleCommand).decorate(
        target.constructor,
        key,
        target[key],
        target.constructor,
        index
      )
    );

    MetadataStorage.instance.addSimpleCommandOption(option);
  };
}
