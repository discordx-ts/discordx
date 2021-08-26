import { Snowflake } from "discord.js";

export class GuildNotFoundError extends Error {
  constructor(guildID: Snowflake) {
    super(`Your bot is not in the guild: ${guildID}`);
  }
}
