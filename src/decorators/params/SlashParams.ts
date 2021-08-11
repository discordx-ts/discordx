import { Snowflake } from "discord.js";

export interface ApplicationCommandParams {
  description?: string;
  defaultPermission?: boolean;
  guilds?: Snowflake[];
  botIds?: string[];
}
