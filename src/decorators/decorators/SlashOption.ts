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
} from "../..";

/**
 * Define option for slash command
 * @param name string
 * ___
 * [View Discord.ts Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/slashoption)
 * @category Decorator
 */
export function SlashOption(name: string): ParameterDecoratorEx;

/**
 * Define option for slash command
 * @param name string
 * @param params additional configuration
 * ___
 * [View Discord.ts Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/slashoption)
 * @category Decorator
 */
export function SlashOption(
  name: string,
  params?: SlashOptionParams
): ParameterDecoratorEx;

export function SlashOption(
  name: string,
  params?: SlashOptionParams
): ParameterDecoratorEx {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: Record<string, any>, key: string, index: number) => {
    const dType = (
      Reflect.getMetadata("design:paramtypes", target, key)[index] as Function
    ).name.toUpperCase();

    const type: SlashOptionType =
      params?.type ?? dType === "NUMBER"
        ? "INTEGER"
        : dType === "GUILDMEMBER"
        ? "USER"
        : dType === "TEXTCHANNEL" || dType === "VOICECHANNEL"
        ? "CHANNEL"
        : (dType as SlashOptionType);

    // throw error if option type is invalid
    if (!SlashOptionTypes.includes(type)) {
      throw Error(`invalid slash option: ${type}`);
    }

    const option = DApplicationCommandOption.create(
      name,
      type,
      params?.description,
      params?.required,
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
