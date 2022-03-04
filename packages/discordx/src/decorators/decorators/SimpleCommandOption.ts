import type { ParameterDecoratorEx } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type { VerifyName } from "../../index.js";
import {
  DSimpleCommand,
  DSimpleCommandOption,
  MetadataStorage,
  SimpleCommandOptionType,
} from "../../index.js";

/**
 * Add a simple command option
 *
 * @param name - Option name
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/simple-command-option)
 *
 * @category Decorator
 */
export function SimpleCommandOption<T extends string>(
  name: VerifyName<T>
): ParameterDecoratorEx;

/**
 * Add a simple command option
 *
 * @param name - Option name
 * @param options - Additional options
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/simple-command-option)
 *
 * @category Decorator
 */
export function SimpleCommandOption<T extends string>(
  name: VerifyName<T>,
  options?: { description?: string; type?: SimpleCommandOptionType }
): ParameterDecoratorEx;

export function SimpleCommandOption(
  name: string,
  options?: { description?: string; type?: SimpleCommandOptionType }
): ParameterDecoratorEx {
  function getType(type: string): SimpleCommandOptionType {
    switch (type) {
      case "STRING": {
        return SimpleCommandOptionType.String;
      }

      case "NUMBER": {
        return SimpleCommandOptionType.Number;
      }

      case "BOOLEAN": {
        return SimpleCommandOptionType.Boolean;
      }

      case "CHANNEL":
      case "TEXTCHANNEL":
      case "VOICECHANNEL": {
        return SimpleCommandOptionType.Channel;
      }

      case "GUILDMEMBER": {
        return SimpleCommandOptionType.User;
      }

      case "ROLE": {
        return SimpleCommandOptionType.Role;
      }

      case "USER":
      case "GUILDMEMBER": {
        return SimpleCommandOptionType.User;
      }

      default:
        throw Error(`Invalid simple command option (${name}): ${type}\n`);
    }
  }

  return function <T>(target: Record<string, T>, key: string, index: number) {
    const dType = (
      Reflect.getMetadata("design:paramtypes", target, key)[
        index
      ] as () => unknown
    ).name.toUpperCase();

    const type: SimpleCommandOptionType = options?.type ?? getType(dType);

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
