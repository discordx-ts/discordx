import {
  MetadataStorage,
  DApplicationCommandOption,
  SlashOptionParams,
  Modifier,
  StringOptionType,
} from "../..";
import { ParameterDecoratorEx } from "../../types/public/decorators";
import { DApplicationCommand } from "../classes/DApplicationCommand";

/**
 * Define option for slash command
 * @param name string
 * ___
 * [View Discord.ts Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/slashoption)
 */
export function SlashOption(name?: string): ParameterDecoratorEx;

/**
 * Define option for slash command
 * @param name string
 * @param params additional configuration
 * ___
 * [View Discord.ts Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/commands/slashoption)
 */
export function SlashOption(
  name: string,
  params?: SlashOptionParams
): ParameterDecoratorEx;

export function SlashOption(name?: string, params?: SlashOptionParams) {
  return (target: Record<string, any>, key: string, index: number) => {
    const type: StringOptionType =
      params?.type ??
      // eslint-disable-next-line @typescript-eslint/ban-types
      ((Reflect.getMetadata("design:paramtypes", target, key) as any[])[
        index
      ] as StringOptionType);

    const option = DApplicationCommandOption.create(
      name ?? key,
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
