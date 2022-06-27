import type {
  ApplicationCommandOptionType,
  AutocompleteInteraction,
} from "discord.js";
import type { LocalizationMap } from "discord-api-types/v10";

import type { ChannelTypes, DApplicationCommand, IGuild } from "../../index.js";

export type ApplicationCommandOptions = {
  botIds?: string[];
  description?: string;
  descriptionLocalizations?: LocalizationMap;
  guilds?: IGuild[];
  nameLocalizations?: LocalizationMap;
};

export type SlashOptionBase = {
  description?: string;
  descriptionLocalizations?: LocalizationMap;
  nameLocalizations?: LocalizationMap;
  required?: boolean;
};

export type SlashOptionBaseOptions = SlashOptionBase & {
  autocomplete?: undefined;
  channelTypes?: undefined;
  maxValue?: undefined;
  minValue?: undefined;
  type?: Exclude<
    ApplicationCommandOptionType,
    | ApplicationCommandOptionType.Subcommand
    | ApplicationCommandOptionType.SubcommandGroup
    | ApplicationCommandOptionType.Channel
  >;
};

export type SlashOptionChannelOptions = SlashOptionBase & {
  autocomplete?: undefined;
  channelTypes?: ChannelTypes[];
  maxValue?: undefined;
  minValue?: undefined;
  type: ApplicationCommandOptionType.Channel;
};

export type SlashOptionAutoCompleteOptions = SlashOptionBase & {
  autocomplete?: SlashAutoCompleteOption;
  channelTypes?: undefined;
  maxValue?: undefined;
  minValue?: undefined;
  type:
    | ApplicationCommandOptionType.String
    | ApplicationCommandOptionType.Number
    | ApplicationCommandOptionType.Integer;
};

export type SlashOptionNumberOptions = SlashOptionBase & {
  autocomplete?: SlashAutoCompleteOption;
  channelTypes?: undefined;
  maxValue?: number;
  minValue?: number;
  type:
    | ApplicationCommandOptionType.Number
    | ApplicationCommandOptionType.Integer;
};

export type SlashOptionOptions =
  | SlashOptionBaseOptions
  | SlashOptionChannelOptions
  | SlashOptionNumberOptions
  | SlashOptionAutoCompleteOptions;

export type SlashAutoCompleteOption =
  | undefined
  | boolean
  | ((
      interaction: AutocompleteInteraction,
      command: DApplicationCommand
    ) => void | Promise<void>);
