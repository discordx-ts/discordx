/* eslint-disable @typescript-eslint/ban-types */
import {
  DApplicationCommand,
  DApplicationCommandOption,
  MetadataStorage,
  Modifier,
  ParameterDecoratorEx,
  SlashOptionParams,
  SlashOptionType,
  SlashOptionTypes,
  VerifyName,
} from "../..";

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
  return <T>(target: Record<string, T>, key: string, index: number) => {
    const dType = (
      Reflect.getMetadata("design:paramtypes", target, key)[index] as Function
    ).name.toUpperCase();

    const type: SlashOptionType =
      params?.type ??
      (dType === "GUILDMEMBER"
        ? "USER"
        : dType === "TEXTCHANNEL" || dType === "VOICECHANNEL"
        ? "CHANNEL"
        : (dType as SlashOptionType));

    // throw error if option type is invalid
    if (!SlashOptionTypes.includes(type)) {
      throw Error(
        `invalid slash option: ${type}\nSupported types are: ${SlashOptionTypes.join(
          ", "
        )}`
      );
    }

    const option = DApplicationCommandOption.create(
      name,
      type,
      params?.description,
      params?.required,
      params?.channelTypes,
      index
    ).decorate(target.constructor, key, target[key], target.constructor, index);

    option.isNode = true;

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

    MetadataStorage.instance.addApplicationCommandOption(option);
  };
}
