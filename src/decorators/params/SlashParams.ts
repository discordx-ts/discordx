import { Snowflake } from "discord.js";

export interface SlashParams {
  description?: string;
  defaultPermission?: boolean;
  guilds?: Snowflake[];
  botIds?: string[];
}
