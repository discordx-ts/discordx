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

export type ApplicationCommandOptions<TName extends string = string> = {
  botIds?: string[];
  defaultMemberPermissions?: PermissionResolvable;
  description?: string;
  descriptionLocalizations?: LocalizationMap;
  dmPermission?: boolean;
  guilds?: IGuild[];
  name: TName;
  nameLocalizations?: LocalizationMap;
};

export type SlashOptionBase = {
  autocomplete?: undefined;
  channelTypes?: undefined;
  description?: string;
  descriptionLocalizations?: LocalizationMap;
  maxLength?: undefined;
  maxValue?: undefined;
  minLength?: undefined;
  minValue?: undefined;
  nameLocalizations?: LocalizationMap;
  required?: boolean;
};

export type SlashOptionBaseOptions = SlashOptionBase & {
  type?: Exclude<
    ApplicationCommandOptionType,
    | ApplicationCommandOptionType.Subcommand
    | ApplicationCommandOptionType.SubcommandGroup
    | ApplicationCommandOptionType.Channel
  >;
};

export type SlashOptionChannelOptions = Omit<
  SlashOptionBase,
  "channelTypes"
> & {
  channelTypes?: ChannelType[];
  type: ApplicationCommandOptionType.Channel;
};

export type SlashOptionAutoCompleteOptions = Omit<
  SlashOptionBase,
  "autocomplete"
> & {
  autocomplete?: SlashAutoCompleteOption;
  type:
    | ApplicationCommandOptionType.String
    | ApplicationCommandOptionType.Number
    | ApplicationCommandOptionType.Integer;
};

export type SlashOptionNumberOptions = Omit<
  SlashOptionBase,
  "maxValue" | "minValue" | "autocomplete"
> & {
  autocomplete?: SlashAutoCompleteOption;
  maxValue?: number;
  minValue?: number;
  type:
    | ApplicationCommandOptionType.Number
    | ApplicationCommandOptionType.Integer;
};

export type SlashOptionStringOptions = Omit<
  SlashOptionBase,
  "maxLength" | "minLength" | "autocomplete"
> & {
  autocomplete?: SlashAutoCompleteOption;
  maxLength?: number;
  minLength?: number;
  type: ApplicationCommandOptionType.String;
};

export type SlashOptionOptions =
  | SlashOptionBaseOptions
  | SlashOptionChannelOptions
  | SlashOptionNumberOptions
  | SlashOptionStringOptions
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
