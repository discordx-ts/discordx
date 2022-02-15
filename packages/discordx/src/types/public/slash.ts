import type { AutocompleteInteraction } from "discord.js";

import type {
  ChannelTypes,
  DApplicationCommand,
  IGuild,
  SlashOptionType,
} from "../../index.js";

export type ApplicationCommandOptions = {
  botIds?: string[];
  defaultPermission?: boolean;
  description?: string;
  guilds?: IGuild[];
};

export type SlashOptionBase = {
  description?: string;
  required?: false;
};

export type SlashOptionBaseOptions = SlashOptionBase & {
  autocomplete?: undefined;
  channelTypes?: undefined;
  maxValue?: undefined;
  minValue?: undefined;
  type?: Exclude<
    SlashOptionType,
    "SUB_COMMAND" | "SUB_COMMAND_GROUP" | "CHANNEL"
  >;
};

export type SlashOptionChannelOptions = SlashOptionBase & {
  autocomplete?: undefined;
  channelTypes?: ChannelTypes[];
  maxValue?: undefined;
  minValue?: undefined;
  type: "CHANNEL";
};

export type SlashOptionAutoCompleteOptions = SlashOptionBase & {
  autocomplete?: SlashAutoCompleteOption;
  channelTypes?: undefined;
  maxValue?: undefined;
  minValue?: undefined;
  type: "STRING" | "NUMBER" | "INTEGER";
};

export type SlashOptionNumberOptions = SlashOptionBase & {
  autocomplete?: SlashAutoCompleteOption;
  channelTypes?: undefined;
  maxValue?: number;
  minValue?: number;
  type: "NUMBER" | "INTEGER";
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
