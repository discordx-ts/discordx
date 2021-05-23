export class GuildNotFoundError extends Error {
  constructor(guildID: string) {
    super(`Your bot is not in the guild: ${guildID}`);
  }
}
