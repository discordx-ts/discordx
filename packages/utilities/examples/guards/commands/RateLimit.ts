/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { RateLimit, TIME_UNIT } from "@discordx/utilities";
import type { CommandInteraction } from "discord.js";
import type { SimpleCommandMessage } from "discordx";
import { Discord, Guard, SimpleCommand, Slash } from "discordx";

@Discord()
export class RateLimitExample {
  /**
   * 1 command every 30 seconds with default message
   *
   * @param interaction
   */
  @Slash({ description: "rate_limit_1", name: "rate_limit_1" })
  @Guard(RateLimit(TIME_UNIT.seconds, 30))
  rateLimit1(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * only one command every 30 seconds with custom message
   *
   * @param interaction
   */
  @Slash({ description: "rate_limit_2", name: "rate_limit_2" })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      message: "Slow Down",
    }),
  )
  rateLimit2(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * Allow 3 command before rate limit of 30 seconds (from last message)
   *
   * @param interaction
   */
  @Slash({ description: "rate_limit_3", name: "rate_limit_3" })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      message: "Please wait `30` seconds!",
      rateValue: 3,
    }),
  )
  rateLimit3(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * only one command every 30 seconds with custom message including time
   *
   * @param interaction
   */
  @Slash({ description: "rate_limit_4", name: "rate_limit_4" })
  @Guard(
    RateLimit(TIME_UNIT.minutes, 5, {
      message: "Slow Down, please try in {time}",
    }),
  )
  rateLimit4(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * only one command every 30 seconds with custom message function resolver including time
   *
   * @param interaction
   */
  @Slash({ description: "rate_limit_5", name: "rate_limit_5" })
  @Guard(
    RateLimit<CommandInteraction>(TIME_UNIT.seconds, 30, {
      message: RateLimitExample.getMessage,
    }),
  )
  rateLimit5(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  private static getMessage(
    this: void,
    interaction: CommandInteraction,
    timeLeft: number,
  ): Promise<string> {
    return Promise.resolve(
      `${
        interaction.commandName
      } will be available again in {time}, this is in ${Math.round(
        timeLeft / 1000,
      )} seconds`,
    );
  }

  /**
   * Rate limit simple command
   *
   * @param message
   */
  @SimpleCommand({ name: "rateLimit" })
  @Guard(RateLimit(TIME_UNIT.seconds, 10))
  rateLimitSimpleCommand({ message }: SimpleCommandMessage): void {
    message.reply("It worked!");
  }
}
