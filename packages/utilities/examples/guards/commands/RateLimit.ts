import type { CommandInteraction } from "discord.js";
import type { SimpleCommandMessage } from "discordx";
import { Discord, Guard, SimpleCommand, Slash } from "discordx";

import { RateLimit, TIME_UNIT } from "../../../src/index.js";

@Discord()
export class RateLimitExample {
  /**
   * 1 command every 30 seconds with default message
   *
   * @param interaction
   */
  @Slash("rate_limit_1")
  @Guard(RateLimit(TIME_UNIT.seconds, 30))
  rateLimit1(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * only one command every 30 seconds with custom message
   *
   * @param interaction
   */
  @Slash("rate_limit_2")
  @Guard(RateLimit(TIME_UNIT.seconds, 30, "Slow Down"))
  rateLimit2(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * Allow 3 command before rate limit of 30 seconds (from last message)
   *
   * @param interaction
   */
  @Slash("rate_limit_3")
  @Guard(RateLimit(TIME_UNIT.seconds, 30, "Please wait `30` seconds!", 3))
  rateLimit3(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * only one command every 30 seconds with custom message including time
   *
   * @param interaction
   */
  @Slash("rate_limit_4")
  @Guard(
    RateLimit(
      TIME_UNIT.seconds,
      30,
      "Slow Down, please try at {until}, if you do not try at {until} then this command will not work"
    )
  )
  rateLimit4(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * Rate limit simple command
   *
   * @param message
   */
  @SimpleCommand("rateLimit")
  @Guard(RateLimit(TIME_UNIT.seconds, 10))
  rateLimitSimpleCommand({ message }: SimpleCommandMessage): void {
    message.reply("It worked!");
  }
}
