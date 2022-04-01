import type {
  ApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType,
} from "discord.js";

export type ApplicationCommandOptionDataX = {
  autocomplete?: boolean;
  channelTypes?: ChannelType[];
  choices?: ApplicationCommandOptionChoice[];
  description: string;
  maxValue?: number;
  minValue?: number;
  name: string;
  options?: ApplicationCommandOptionDataX[];
  required?: boolean;
  type: ApplicationCommandOptionType;
};

export type ApplicationCommandDataX = {
  defaultPermission: boolean;
  description: string;
  name: string;
  options: ApplicationCommandOptionDataX[];
  type: ApplicationCommandType;
};
