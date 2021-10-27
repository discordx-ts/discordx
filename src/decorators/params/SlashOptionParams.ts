import { DApplicationCommand, SlashOptionType } from "../..";
import { AutocompleteInteraction } from "discord.js";
import { ChannelTypes } from "discord.js/typings/enums";

interface SlashOptionBase {
  description?: string;
  required?: boolean;
}

interface SlashOptionBaseParams extends SlashOptionBase {
  autocomplete?: undefined;
  channelTypes?: undefined;
  type?: Exclude<
    SlashOptionType,
    "SUB_COMMAND" | "SUB_COMMAND_GROUP" | "CHANNEL"
  >;
}

interface SlashOptionChannelParams extends SlashOptionBase {
  autocomplete?: undefined;
  channelTypes?: Exclude<ChannelTypes, ChannelTypes.UNKNOWN>[];
  type: "CHANNEL";
}

interface SlashOptionAutoCompleteParams extends SlashOptionBase {
  autocomplete?: SlashAutoCompleteOption;
  channelTypes?: undefined;
  type: "STRING";
}

export type SlashOptionParams =
  | SlashOptionBaseParams
  | SlashOptionChannelParams
  | SlashOptionAutoCompleteParams;

export type SlashAutoCompleteOption =
  | undefined
  | boolean
  | ((
      interaction: AutocompleteInteraction,
      command: DApplicationCommand
    ) => void | Promise<void>);
