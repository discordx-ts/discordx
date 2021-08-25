import {
  GuildChannel,
  GuildMember,
  Role,
  ThreadChannel,
  User,
} from "discord.js";

export type SubCommand = {
  [key: string]: string;
};

export const SlashOptionTypes = <const>[
  "STRING",
  "BOOLEAN",
  "INTEGER",
  "NUMBER",
  "CHANNEL",
  "ROLE",
  "USER",
  "MENTIONABLE",
  "SUB_COMMAND",
  "SUB_COMMAND_GROUP",
];

export type SlashOptionType = typeof SlashOptionTypes[number];

export type SimpleCommandOptionType =
  | string
  | number
  | boolean
  | ThreadChannel
  | GuildChannel
  | User
  | GuildMember
  | Role
  | null
  | undefined;

export const SimpleCommandTypes = <const>[
  "STRING",
  "INTEGER",
  "NUMBER",
  "BOOLEAN",
  "USER",
  "CHANNEL",
  "ROLE",
  "MENTIONABLE",
];

export type SimpleCommandType = typeof SimpleCommandTypes[number];
