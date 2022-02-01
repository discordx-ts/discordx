import type {
  ApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType,
} from "discord.js";

export interface ApplicationCommandOptionDataX {
  autocomplete?: boolean;
  channelTypes?: ChannelType[];
  choices?: ApplicationCommandOptionChoice[];
  description: string | undefined;
  maxValue?: number;
  minValue?: number;
  name: string;
  options?: ApplicationCommandOptionDataX[];
  required?: boolean;
  type: ApplicationCommandOptionType;
}

export interface ApplicationCommandDataX {
  defaultPermission: boolean;
  description: string;
  name: string;
  options: ApplicationCommandOptionDataX[];
  type: ApplicationCommandType;
}
