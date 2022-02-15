import type { ParameterDecoratorEx } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type { SimpleCommandType, VerifyName } from "../../index.js";
import {
  DSimpleCommand,
  DSimpleCommandOption,
  MetadataStorage,
  SimpleCommandTypes,
} from "../../index.js";

/**
 * Add a simple command option
 *
 * @param name Option name
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/simplecommandoption)
 *
 * @category Decorator
 */
export function SimpleCommandOption<T extends string>(
  name: VerifyName<T>
): ParameterDecoratorEx;

/**
 * Add a simple command option
 *
 * @param name Option name
 * @param options Additional options
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/simplecommandoption)
 *
 * @category Decorator
 */
export function SimpleCommandOption<T extends string>(
  name: VerifyName<T>,
  options?: { description?: string; type?: SimpleCommandType }
): ParameterDecoratorEx;

export function SimpleCommandOption(
  name: string,
  options?: { description?: string; type?: SimpleCommandType }
): ParameterDecoratorEx {
  return function <T>(target: Record<string, T>, key: string, index: number) {
    const dType = (
      Reflect.getMetadata("design:paramtypes", target, key)[
        index
      ] as () => unknown
    ).name.toUpperCase();

    const type: SimpleCommandType =
      options?.type ??
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
      options?.description
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
