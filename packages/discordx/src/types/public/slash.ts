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
  name?: TName;
  nameLocalizations?: LocalizationMap;
};

export type SlashOptionBase<TName extends string = string> = {
  autocomplete?: undefined;
  channelTypes?: undefined;
  description?: string;
  descriptionLocalizations?: LocalizationMap;
  maxLength?: undefined;
  maxValue?: undefined;
  minLength?: undefined;
  minValue?: undefined;
  name: TName;
  nameLocalizations?: LocalizationMap;
  required?: boolean;
};

export type SlashOptionBaseOptions<TName extends string = string> =
  SlashOptionBase<TName> & {
    type?: Exclude<
      ApplicationCommandOptionType,
      | ApplicationCommandOptionType.Subcommand
      | ApplicationCommandOptionType.SubcommandGroup
      | ApplicationCommandOptionType.Channel
    >;
  };

export type SlashOptionChannelOptions<TName extends string = string> = Omit<
  SlashOptionBase<TName>,
  "channelTypes"
> & {
  channelTypes?: ChannelType[];
  type: ApplicationCommandOptionType.Channel;
};

export type SlashOptionAutoCompleteOptions<TName extends string = string> =
  Omit<SlashOptionBase<TName>, "autocomplete"> & {
    autocomplete?: SlashAutoCompleteOption;
    type:
      | ApplicationCommandOptionType.String
      | ApplicationCommandOptionType.Number
      | ApplicationCommandOptionType.Integer;
  };

export type SlashOptionNumberOptions<TName extends string = string> = Omit<
  SlashOptionBase<TName>,
  "maxValue" | "minValue" | "autocomplete"
> & {
  autocomplete?: SlashAutoCompleteOption;
  maxValue?: number;
  minValue?: number;
  type:
    | ApplicationCommandOptionType.Number
    | ApplicationCommandOptionType.Integer;
};

export type SlashOptionStringOptions<TName extends string = string> = Omit<
  SlashOptionBase<TName>,
  "maxLength" | "minLength" | "autocomplete"
> & {
  autocomplete?: SlashAutoCompleteOption;
  maxLength?: number;
  minLength?: number;
  type: ApplicationCommandOptionType.String;
};

export type SlashOptionOptions<TName extends string = string> =
  | SlashOptionBaseOptions<TName>
  | SlashOptionChannelOptions<TName>
  | SlashOptionNumberOptions<TName>
  | SlashOptionStringOptions<TName>
  | SlashOptionAutoCompleteOptions<TName>;

export type SlashAutoCompleteOption =
  | undefined
  | boolean
  | ((
      interaction: AutocompleteInteraction,
      command: DApplicationCommand
    ) => void | Promise<void>);

export type ApplicationCommandDataEx = {
  defaultMemberPermissions?: PermissionResolvable | null;
  description?: string;
  descriptionLocalizations?: LocalizationMap | null;
  dmPermission?: boolean;
  name: string;
  nameLocalizations?: LocalizationMap | null;
  options: ApplicationCommandOptionData[];
  type: ApplicationCommandType;
};
