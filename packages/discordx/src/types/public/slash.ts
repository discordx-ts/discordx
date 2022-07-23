import type {
  ApplicationCommandOptionData,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  AutocompleteInteraction,
  ChannelType,
  LocalizationMap,
  PermissionResolvable,
} from "discord.js";

import type { DApplicationCommand, IGuild } from "../../index.js";

export type ApplicationCommandOptions = {
  botIds?: string[];
  defaultMemberPermissions?: PermissionResolvable;
  description?: string;
  descriptionLocalizations?: LocalizationMap;
  dmPermission?: boolean;
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

export type ApplicationCommandDataEx = {
  defaultMemberPermissions?: PermissionResolvable;
  description: string;
  descriptionLocalizations?: LocalizationMap;
  dmPermission?: boolean;
  name: string;
  nameLocalizations?: LocalizationMap;
  options: ApplicationCommandOptionData[];
  type: ApplicationCommandType;
};
