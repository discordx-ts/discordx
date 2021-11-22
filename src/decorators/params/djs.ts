import { ChannelTypes, SlashOptionType } from "../../index.js";
import { ApplicationCommandOptionChoice } from "discord.js";

export interface ApplicationCommandOptionDatax {
  autocomplete?: boolean;
  channelTypes?: ChannelTypes[];
  choices?: ApplicationCommandOptionChoice[];
  description: string;
  maxValue?: number;
  minValue?: number;
  name: string;
  options?: ApplicationCommandOptionDatax[];
  required?: boolean;
  type: SlashOptionType;
}
