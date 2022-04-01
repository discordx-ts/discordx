import type {
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  ChannelType,
} from "discord.js";

import type { DApplicationCommand, IGuild } from "../../index.js";

export type ApplicationCommandOptions = {
  botIds?: string[];
  defaultPermission?: boolean;
  description?: string;
  guilds?: IGuild[];
};

export type SlashOptionBase = {
  description?: string;
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
  channelTypes?: ChannelType[];
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
