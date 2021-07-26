import { Snowflake } from "discord.js";

export interface CommandParams {
  argSplitter?: string;
  description?: string;
  directMessage?: boolean;
  defaultPermission?: boolean;
  guilds?: Snowflake[];
  botIds?: string[];
  aliases?: string[];
}
