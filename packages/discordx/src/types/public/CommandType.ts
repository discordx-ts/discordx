import type {
  GuildChannel,
  GuildMember,
  Role,
  ThreadChannel,
  User,
} from "discord.js";

export type SubCommand = {
  [key: string]: string;
};

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

export const SimpleCommandTypes = [
  "STRING",
  "INTEGER",
  "NUMBER",
  "BOOLEAN",
  "USER",
  "CHANNEL",
  "ROLE",
  "MENTIONABLE",
] as const;

export type SimpleCommandType = typeof SimpleCommandTypes[number];
