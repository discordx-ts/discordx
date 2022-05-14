import type { ParameterDecoratorEx } from "@discordx/internal";
import { Modifier } from "@discordx/internal";
import type { ApplicationCommandOptionType } from "discord.js";

import type { SlashOptionOptions, VerifyName } from "../../index.js";
import {
  DApplicationCommand,
  DApplicationCommandOption,
  MetadataStorage,
} from "../../index.js";

/**
 * Add a slash command option
 *
 * @param name - Option name
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/slash-option)
 *
 * @category Decorator
 */
export function SlashOption<T extends string>(
  name: VerifyName<T>
): ParameterDecoratorEx;

/**
 * Add a slash command option
 *
 * @param name - Option name
 * @param options - Additional options
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/slash-option)
 *
 * @category Decorator
 */
export function SlashOption<T extends string>(
  name: VerifyName<T>,
  options?: SlashOptionOptions
): ParameterDecoratorEx;

export function SlashOption(
  name: string,
  options?: SlashOptionOptions
): ParameterDecoratorEx {
  function getType(type: string): ApplicationCommandOptionType {
    switch (type) {
      case "GUILDMEMBER": {
        return "USER";
      }

      case "TEXTCHANNEL":
      case "VOICECHANNEL": {
        return "CHANNEL";
      }

      case "FUNCTION":
        throw Error(`invalid slash option (${name}): ${type}`);

      default:
        return type as ApplicationCommandOptionType;
    }
  }

  return function <T>(target: Record<string, T>, key: string, index: number) {
    const reflectedType = (
      Reflect.getMetadata("design:paramtypes", target, key)[
        index
      ] as () => unknown
    ).name.toUpperCase();

    const type: ApplicationCommandOptionType =
      options?.type ?? getType(reflectedType);

    const option = DApplicationCommandOption.create(
      name,
      options?.autocomplete,
      options?.channelTypes,
      options?.description,
      index,
      options?.maxValue,
      options?.minValue,
      options?.required,
      type,
      options?.descriptionLocalizations,
      options?.nameLocalizations
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
