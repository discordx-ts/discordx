import type { ParameterDecoratorEx } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type {
  SlashOptionParams,
  SlashOptionType,
  VerifyName,
} from "../../index.js";
import {
  DApplicationCommand,
  DApplicationCommandOption,
  MetadataStorage,
  SlashOptionTypes,
} from "../../index.js";

/**
 * Define option for slash command
 * ___
 * [View Discord.ts Documentation](https://discord-ts.js.org/docs/decorators/commands/slashoption)
 * @category Decorator
 */
export function SlashOption<T extends string>(
  name: VerifyName<T>
): ParameterDecoratorEx;
export function SlashOption<T extends string>(
  name: VerifyName<T>,
  params?: SlashOptionParams
): ParameterDecoratorEx;

export function SlashOption(
  name: string,
  params?: SlashOptionParams
): ParameterDecoratorEx {
  function getType(type: string): SlashOptionType {
    switch (type) {
      case "GUILDMEMBER": {
        return "USER";
      }
      case "TEXTCHANNEL":
      case "VOICECHANNEL": {
        return "CHANNEL";
      }
      case "FUNCTION":
        throw Error(
          `invalid slash option (${name}): ${type}\nSupported types are: ${SlashOptionTypes.join(
            ", "
          )}\n`
        );
      default:
        return type as SlashOptionType;
    }
  }

  return function <T>(target: Record<string, T>, key: string, index: number) {
    const reflectedType = (
      Reflect.getMetadata("design:paramtypes", target, key)[
        index
      ] as () => unknown
    ).name.toUpperCase();

    const type: SlashOptionType = params?.type ?? getType(reflectedType);

    const option = DApplicationCommandOption.create(
      name,
      params?.autocomplete,
      params?.channelTypes,
      params?.description,
      index,
      params?.maxValue,
      params?.minValue,
      params?.required,
      type
    ).decorate(target.constructor, key, target[key], target.constructor, index);

    MetadataStorage.instance.addModifier(
      Modifier.create<DApplicationCommand>((original) => {
        original.options = [...original.options, option];
      }, DApplicationCommand).decorate(
        target.constructor,
        key,
        target[key],
        target.constructor,
        index
      )
    );

    MetadataStorage.instance.addApplicationCommandSlashOption(option);
  };
}
