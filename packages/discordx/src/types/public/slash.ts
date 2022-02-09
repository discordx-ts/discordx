import type { AutocompleteInteraction } from "discord.js";

import type {
  ChannelTypes,
  DApplicationCommand,
  IGuild,
  SlashOptionType,
} from "../../index.js";

export type ApplicationCommandParams = {
  botIds?: string[];
  defaultPermission?: boolean;
  description?: string;
  guilds?: IGuild[];
};

export type SlashOptionBase = {
  description?: string;
  required?: false;
};

export type SlashOptionBaseParams = SlashOptionBase & {
  autocomplete?: undefined;
  channelTypes?: undefined;
  maxValue?: undefined;
  minValue?: undefined;
  type?: Exclude<
    SlashOptionType,
    "SUB_COMMAND" | "SUB_COMMAND_GROUP" | "CHANNEL"
  >;
};

export type SlashOptionChannelParams = SlashOptionBase & {
  autocomplete?: undefined;
  channelTypes?: ChannelTypes[];
  maxValue?: undefined;
  minValue?: undefined;
  type: "CHANNEL";
};

export type SlashOptionAutoCompleteParams = SlashOptionBase & {
  autocomplete?: SlashAutoCompleteOption;
  channelTypes?: undefined;
  maxValue?: undefined;
  minValue?: undefined;
  type: "STRING" | "NUMBER" | "INTEGER";
};

export type SlashOptionNumberParams = SlashOptionBase & {
  autocomplete?: SlashAutoCompleteOption;
  channelTypes?: undefined;
  maxValue?: number;
  minValue?: number;
  type: "NUMBER" | "INTEGER";
};

export type SlashOptionParams =
  | SlashOptionBaseParams
  | SlashOptionChannelParams
  | SlashOptionNumberParams
  | SlashOptionAutoCompleteParams;

export type SlashAutoCompleteOption =
  | undefined
  | boolean
  | ((
      interaction: AutocompleteInteraction,
      command: DApplicationCommand
    ) => void | Promise<void>);
