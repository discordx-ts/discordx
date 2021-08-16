import { Snowflake } from "discord.js";

export interface CommandParams {
  argSplitter?: string | RegExp;
  description?: string;
  directMessage?: boolean;
  defaultPermission?: boolean;
  guilds?: Snowflake[];
  botIds?: string[];
  aliases?: string[];
}

export type SimpleCommandType =
  | "STRING"
  | "NUMBER"
  | "BOOLEAN"
  | "USER"
  | "CHANNEL"
  | "ROLE";
