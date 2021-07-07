import {
  Channel,
  ClientUser,
  Role,
  TextChannel,
  User,
  VoiceChannel,
} from "discord.js";

export type SubCommand = {
  [key: string]: string;
};

export type StringOptionType =
  | "STRING"
  | "BOOLEAN"
  | "INTEGER"
  | "CHANNEL"
  | "ROLE"
  | "USER"
  | "MENTIONABLE"
  | "SUB_COMMAND"
  | "SUB_COMMAND_GROUP";

export enum OptionType {
  STRING = "STRING",
  BOOLEAN = "BOOLEAN",
  INTEGER = "INTEGER",
  CHANNEL = "CHANNEL",
  ROLE = "ROLE",
  USER = "USER",
  MENTIONABLE = "MENTIONABLE",
  SUB_COMMAND = "SUB_COMMAND",
  SUB_COMMAND_GROUP = "SUB_COMMAND_GROUP",
}

export type StringSubType = "SUB_COMMAND" | "SUB_COMMAND_GROUP";

export enum SubType {
  SUB_COMMAND = "SUB_COMMAND",
  SUB_COMMAND_GROUP = "SUB_COMMAND_GROUP",
}

export type SubValueType = StringSubType | SubType;

export type OptionValueType =
  | typeof String
  | typeof Boolean
  | typeof Number
  | typeof User
  | typeof ClientUser
  | typeof Channel
  | typeof TextChannel
  | typeof VoiceChannel
  | typeof Role
  | OptionType
  | StringOptionType;
