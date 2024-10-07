/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { ParameterDecoratorEx } from "@discordx/internal";
import { Modifier } from "@discordx/internal";
import {
  SlashCommandAttachmentOption,
  SlashCommandBooleanOption,
  SlashCommandChannelOption,
  SlashCommandIntegerOption,
  SlashCommandMentionableOption,
  SlashCommandNumberOption,
  SlashCommandRoleOption,
  SlashCommandStringOption,
  SlashCommandUserOption,
} from "discord.js";

import type {
  NotEmpty,
  SlashOptionOptions,
  TransformerFunction,
  VerifyName,
} from "../../index.js";
import {
  DApplicationCommand,
  DApplicationCommandOption,
  DApplicationCommandOptionChoice,
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
export function SlashOption(
  options:
    | SlashCommandAttachmentOption
    | SlashCommandBooleanOption
    | SlashCommandChannelOption
    | SlashCommandIntegerOption
    | SlashCommandMentionableOption
    | SlashCommandNumberOption
    | SlashCommandRoleOption
    | SlashCommandStringOption
    | SlashCommandUserOption,
  transformer?: TransformerFunction,
): ParameterDecoratorEx;

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
  transformer?: TransformerFunction,
): ParameterDecoratorEx;

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
  options:
    | SlashCommandAttachmentOption
    | SlashCommandBooleanOption
    | SlashCommandChannelOption
    | SlashCommandIntegerOption
    | SlashCommandMentionableOption
    | SlashCommandNumberOption
    | SlashCommandRoleOption
    | SlashCommandStringOption
    | SlashCommandUserOption
    | SlashOptionOptions<VerifyName<T>, NotEmpty<TD>>,
  transformer?: TransformerFunction,
): ParameterDecoratorEx {
  return function (target: Record<string, any>, key: string, index: number) {
    SlashNameValidator(options.name);

    let option: DApplicationCommandOption;

    if (
      options instanceof SlashCommandAttachmentOption ||
      options instanceof SlashCommandBooleanOption ||
      options instanceof SlashCommandRoleOption ||
      options instanceof SlashCommandMentionableOption ||
      options instanceof SlashCommandUserOption
    ) {
      option = DApplicationCommandOption.create({
        description: options.description,
        descriptionLocalizations: options.description_localizations,
        index: index,
        name: options.name,
        nameLocalizations: options.name_localizations,
        required: options.required,
        transformer,
        type: options.type,
      });
    } else if (options instanceof SlashCommandChannelOption) {
      option = DApplicationCommandOption.create({
        channelType: options.channel_types,
        description: options.description,
        descriptionLocalizations: options.description_localizations,
        index: index,
        name: options.name,
        nameLocalizations: options.name_localizations,
        required: options.required,
        transformer,
        type: options.type,
      });
    } else if (
      options instanceof SlashCommandIntegerOption ||
      options instanceof SlashCommandNumberOption
    ) {
      const choices = options.choices?.map((choice) =>
        DApplicationCommandOptionChoice.create(choice),
      );

      option = DApplicationCommandOption.create({
        autocomplete: options.autocomplete,
        choices,
        description: options.description,
        descriptionLocalizations: options.description_localizations,
        index: index,
        maxValue: options.max_value,
        minValue: options.min_value,
        name: options.name,
        nameLocalizations: options.name_localizations,
        required: options.required,
        transformer,
        type: options.type,
      });
    } else if (options instanceof SlashCommandStringOption) {
      const choices = options.choices?.map((choice) =>
        DApplicationCommandOptionChoice.create(choice),
      );

      option = DApplicationCommandOption.create({
        autocomplete: options.autocomplete,
        choices,
        description: options.description,
        descriptionLocalizations: options.description_localizations,
        index: index,
        maxLength: options.max_length,
        minLength: options.min_length,
        name: options.name,
        nameLocalizations: options.name_localizations,
        required: options.required,
        transformer,
        type: options.type,
      });
    } else {
      option = DApplicationCommandOption.create({
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
        transformer: transformer,
        type: options.type,
      });
    }

    option.decorate(
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
