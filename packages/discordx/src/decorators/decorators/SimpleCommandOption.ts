import type { ParameterDecoratorEx } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type { SimpleCommandOptionOptions } from "../../index.js";
import {
  DSimpleCommand,
  DSimpleCommandOption,
  MetadataStorage,
  SimpleCommandOptionType,
} from "../../index.js";

/**
 * Add a simple command option
 *
 * @param options - Command option options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/simple-command-option)
 *
 * @category Decorator
 */
export function SimpleCommandOption<TName extends string>(
  options: SimpleCommandOptionOptions<TName>
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

      case "ROLE": {
        return SimpleCommandOptionType.Role;
      }

      case "USER":
      case "GUILDMEMBER": {
        return SimpleCommandOptionType.User;
      }

      default:
        throw Error(
          `Invalid simple command option (${options.name}): ${type}\n`
        );
    }
  }

  return function (target: Record<string, any>, key: string, index: number) {
    const dType = (
      Reflect.getMetadata("design:paramtypes", target, key)[
        index
      ] as () => unknown
    ).name.toUpperCase();

    const type: SimpleCommandOptionType = options?.type ?? getType(dType);

    const option = DSimpleCommandOption.create({
      description: options.description,
      name: options.name,
      type,
    }).decorate(
      target.constructor,
      key,
      target[key],
      target.constructor,
      index
    );

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
