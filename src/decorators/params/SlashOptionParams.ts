import { ChannelTypes } from "discord.js/typings/enums";
import { SlashOptionType } from "../..";

interface SlashOptionBase {
  description?: string;
  required?: boolean;
}

interface SlashOptionBaseParams extends SlashOptionBase {
  channelTypes?: undefined;
  type?: Exclude<
    SlashOptionType,
    "SUB_COMMAND" | "SUB_COMMAND_GROUP" | "CHANNEL"
  >;
}

interface SlashOptionChannelParams extends SlashOptionBase {
  channelTypes?: Exclude<ChannelTypes, ChannelTypes.UNKNOWN>[];
  type: "CHANNEL";
}

export type SlashOptionParams =
  | SlashOptionBaseParams
  | SlashOptionChannelParams;
