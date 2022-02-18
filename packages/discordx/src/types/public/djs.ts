import type { ApplicationCommandOptionChoice } from "discord.js";

import type { ChannelTypes, SlashOptionType } from "../../index.js";

export type ApplicationCommandOptionDataX = {
  autocomplete?: boolean;
  channelTypes?: ChannelTypes[];
  choices?: ApplicationCommandOptionChoice[];
  description: string;
  maxValue?: number;
  minValue?: number;
  name: string;
  options?: ApplicationCommandOptionDataX[];
  required?: boolean;
  type: SlashOptionType;
};

export type ApplicationCommandDataX = {
  defaultPermission: boolean;
  description: string;
  name: string;
  options: ApplicationCommandOptionDataX[];
  type: string;
};
