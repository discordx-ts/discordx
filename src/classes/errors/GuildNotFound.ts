import { Snowflake } from "discord.js";

export class GuildNotFoundError extends Error {
  constructor(guildId: Snowflake) {
    super(`Your bot is not in the guild: ${guildId}`);
  }
}
