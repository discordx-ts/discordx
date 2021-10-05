import { ChannelTypes } from "discord.js/typings/enums";
import { SlashOptionType } from "../..";

interface SlashOptionBase {
  description?: string;
  required?: boolean;
}

interface SlashOptionBaseParams extends SlashOptionBase {
  type?: Exclude<
    SlashOptionType,
    "SUB_COMMAND" | "SUB_COMMAND_GROUP" | "CHANNEL"
  >;
  channelTypes?: undefined;
}

interface SlashOptionChannelParams extends SlashOptionBase {
  type: "CHANNEL";
  channelTypes?: Exclude<ChannelTypes, ChannelTypes.UNKNOWN>[];
}

export type SlashOptionParams =
  | SlashOptionBaseParams
  | SlashOptionChannelParams;
