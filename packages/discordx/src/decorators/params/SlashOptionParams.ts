import type { AutocompleteInteraction } from "discord.js";

import type {
  ChannelTypes,
  DApplicationCommand,
  SlashOptionType,
} from "../../index.js";

interface SlashOptionBase {
  description?: string;
  required?: false;
}

interface SlashOptionBaseParams extends SlashOptionBase {
  autocomplete?: undefined;
  channelTypes?: undefined;
  maxValue?: undefined;
  minValue?: undefined;
  type?: Exclude<
    SlashOptionType,
    "SUB_COMMAND" | "SUB_COMMAND_GROUP" | "CHANNEL"
  >;
}

interface SlashOptionChannelParams extends SlashOptionBase {
  autocomplete?: undefined;
  channelTypes?: ChannelTypes[];
  maxValue?: undefined;
  minValue?: undefined;
  type: "CHANNEL";
}

interface SlashOptionAutoCompleteParams extends SlashOptionBase {
  autocomplete?: SlashAutoCompleteOption;
  channelTypes?: undefined;
  maxValue?: undefined;
  minValue?: undefined;
  type: "STRING" | "NUMBER" | "INTEGER";
}

interface SlashOptionNumberParams extends SlashOptionBase {
  autocomplete?: SlashAutoCompleteOption;
  channelTypes?: undefined;
  maxValue?: number;
  minValue?: number;
  type: "NUMBER" | "INTEGER";
}

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
