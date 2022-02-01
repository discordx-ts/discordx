import type { ParameterDecoratorEx } from "@discordx/internal";
import { Modifier } from "@discordx/internal";
import { ApplicationCommandOptionType } from "discord.js";

import type { SlashOptionParams, VerifyName } from "../../index.js";
import {
  DApplicationCommand,
  DApplicationCommandOption,
  MetadataStorage,
} from "../../index.js";

function getSlashType(type: string): ApplicationCommandOptionType {
  switch (type) {
    case "STRING": {
      return ApplicationCommandOptionType.String;
    }

    case "BOOLEAN": {
      return ApplicationCommandOptionType.Boolean;
    }

    case "INTEGER": {
      return ApplicationCommandOptionType.Integer;
    }

    case "NUMBER": {
      return ApplicationCommandOptionType.String;
    }

    case "CHANNEL": {
      return ApplicationCommandOptionType.Channel;
    }

    case "TEXTCHANNEL":
    case "VOICECHANNEL":
    case "VOICECHANNEL": {
      return ApplicationCommandOptionType.Channel;
    }

    case "ROLE": {
      return ApplicationCommandOptionType.Role;
    }

    case "USER":
    case "GUILDMEMBER": {
      return ApplicationCommandOptionType.User;
    }

    case "MENTIONABLE": {
      return ApplicationCommandOptionType.Mentionable;
    }

    case "SUB_COMMAND": {
      return ApplicationCommandOptionType.Subcommand;
    }

    case "SUB_COMMAND_GROUP": {
      return ApplicationCommandOptionType.SubcommandGroup;
    }

    default:
      throw Error(`invalid slash option: ${type}`);
  }
}

/**
 * Define option for slash command
 * @param name string
 * ___
 * [View Discord.ts Documentation](https://discord-ts.js.org/docs/decorators/commands/slashoption)
 * @category Decorator
 */
export function SlashOption<T extends string>(
  name: VerifyName<T>
): ParameterDecoratorEx;

/**
 * Define option for slash command
 * @param name string
 * @param params additional configuration
 * ___
 * [View Discord.ts Documentation](https://discord-ts.js.org/docs/decorators/commands/slashoption)
 * @category Decorator
 */
export function SlashOption<T extends string>(
  name: VerifyName<T>,
  params?: SlashOptionParams
): ParameterDecoratorEx;

export function SlashOption(
  name: string,
  params?: SlashOptionParams
): ParameterDecoratorEx {
  return function <T>(target: Record<string, T>, key: string, index: number) {
    const dType =
      params?.type ??
      (
        Reflect.getMetadata("design:paramtypes", target, key)[
          index
        ] as () => unknown
      ).name.toUpperCase();

    const type = typeof dType === "string" ? getSlashType(dType) : dType;

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
