import type { BaseCommandInteraction } from "discord.js";
import type { Awaitable, SimpleCommandMessage } from "discordx";

export interface RateLimitOption<
  T extends BaseCommandInteraction | SimpleCommandMessage
> {
  /**
   * for interaction only
   */
  ephemeral: boolean;
  /**
   * the message to post when a command is called when the
   * user is in rate limit, defaults = "message being rate limited!, please try again at {until}".
   * use the placeholder {until} in your string to get the time you can next call it `<t:epoch:T>`
   * If a function is supplied, it will pass both the interaction and how many milliseconds are left until the rate limit is over
   */
  message: ((interaction: T, timeLeft: number) => Awaitable<string>) | string;
  /**
   * the value to specify how many messages can be called before it is rate limited, defaults to 1
   */
  rateValue: number;
}
