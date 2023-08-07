import type { ParameterDecoratorEx } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type { NotEmpty, SlashOptionOptions, VerifyName } from "../../index.js";
import {
  DApplicationCommand,
  DApplicationCommandOption,
  MetadataStorage,
  SlashNameValidator,
} from "../../index.js";

/**
 * Add a slash command option
 *
 * @param options - Slash option options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/decorators/command/slash-option)
 *
 * @category Decorator
 */
export function SlashOption<T extends string, TD extends string>(
  options: SlashOptionOptions<VerifyName<T>, NotEmpty<TD>>,
): ParameterDecoratorEx {
  return function (target: Record<string, any>, key: string, index: number) {
    SlashNameValidator(options.name);

    const option = DApplicationCommandOption.create({
      autocomplete: options.autocomplete,
      channelType: options.channelTypes,
      description: options.description,
      descriptionLocalizations: options.descriptionLocalizations,
      index: index,
      maxLength: options.maxLength,
      maxValue: options.maxValue,
      minLength: options.minLength,
      minValue: options.minValue,
      name: options.name,
      nameLocalizations: options.nameLocalizations,
      required: options.required,
      transformer: options.transformer,
      type: options.type,
    }).decorate(
      target.constructor,
      key,
      target[key],
      target.constructor,
      index,
    );

    MetadataStorage.instance.addModifier(
      Modifier.create<DApplicationCommand>((original) => {
        original.options = [...original.options, option];
      }, DApplicationCommand).decorate(
        target.constructor,
        key,
        target[key],
        target.constructor,
        index,
      ),
    );

    MetadataStorage.instance.addApplicationCommandSlashOption(option);
  };
}
