import {
  GuildChannel,
  GuildMember,
  Role,
  Snowflake,
  ThreadChannel,
  User,
} from "discord.js";

export interface CommandParams {
  argSplitter?: string | RegExp;
  description?: string;
  directMessage?: boolean;
  defaultPermission?: boolean;
  guilds?: Snowflake[];
  botIds?: string[];
  aliases?: string[];
}

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

export type SimpleCommandType =
  | "STRING"
  | "NUMBER"
  | "BOOLEAN"
  | "USER"
  | "CHANNEL"
  | "ROLE";
