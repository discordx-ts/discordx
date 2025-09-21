/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type {
  CommandInteraction,
  MessageComponentInteraction,
} from "discord.js";
import { SimpleCommandMessage, type GuardFunction } from "discordx";

import { dayjs } from "../../useful/time-format.js";
import { TIME_UNIT, TimedSet, type RateLimitOption } from "./index.js";
import { TimeOutEntry } from "./logic/index.js";

/**
 * Rate limit this command, specify the time unit and the value and optionally the threshold and the message
 * to post when someone calls the command within the rate limit
 *
 * @param timeout - the time unit to use
 * @param value - the value for the time unit
 * @param options - rate limit options
 *
 * @constructor
 */
export function RateLimit<T extends CommandInteraction | SimpleCommandMessage>(
  timeout: TIME_UNIT,
  value: number,
  options: RateLimitOption<T> = {
    ephemeral: true,
    message: "message being rate limited!, please try again in {time}",
    rateValue: 1,
  },
): GuardFunction<T> {
  const rateValue = options.rateValue ?? 1;
  const rateMessage =
    options.message ??
    "message being rate limited!, please try again in {time}";

  function convertToMillisecond(timeValue: number, unit: TIME_UNIT): number {
    switch (unit) {
      case TIME_UNIT.seconds:
        return timeValue * 1000;
      case TIME_UNIT.minutes:
        return timeValue * 60000;
      case TIME_UNIT.hours:
        return timeValue * 3600000;
      case TIME_UNIT.days:
        return timeValue * 86400000;
      default:
        return 1000;
    }
  }

  const _millisecond = convertToMillisecond(value, timeout);
  const _timer = new TimedSet<TimeOutEntry>(_millisecond);

  async function replyOrFollowUp(
    interaction: CommandInteraction | MessageComponentInteraction,
    content: string,
    ephemeral: boolean,
  ): Promise<void> {
    if (interaction.replied) {
      await interaction.followUp({
        content,
        ephemeral,
      });
      return;
    }

    if (interaction.deferred) {
      await interaction.editReply(content);
      return;
    }

    await interaction.reply({
      content,
      ephemeral,
    });
  }

  function getFromArray(
    userId: string,
    guildId: string,
  ): TimeOutEntry | undefined {
    const arr = _timer.rawSet;
    return arr.find(
      (v: TimeOutEntry) => v.userId === userId && v.guildId === guildId,
    );
  }

  function getTimeLeft(item: TimeOutEntry): number {
    return _timer.getTimeRemaining(item);
  }

  async function post(
    arg: CommandInteraction | SimpleCommandMessage,
    msg: string,
  ): Promise<void> {
    if (arg instanceof SimpleCommandMessage) {
      await arg.message.reply(msg);
    } else {
      await replyOrFollowUp(arg, msg, options.ephemeral ?? true);
    }
  }

  return async function (arg, client, next) {
    let memberId: string | null = null;
    let guildId: string | null = null;

    if (arg instanceof SimpleCommandMessage) {
      memberId = arg.message.member?.id ?? null;
      guildId = arg.message.guildId;
    } else if (!arg.isAutocomplete()) {
      memberId = arg.member?.user.id ?? null;
      guildId = arg.guildId;
    }

    if (!memberId || !guildId) {
      return next();
    }

    let fromArray = getFromArray(memberId, guildId);
    if (fromArray) {
      fromArray.incrementCallCount();
      if (fromArray.hasLimitReached()) {
        /**
         * Get time left
         */
        const timeLeft = getTimeLeft(fromArray);

        /**
         * Get message string
         */
        let messageString =
          typeof rateMessage === "function"
            ? await rateMessage(arg, timeLeft)
            : rateMessage;

        /**
         * Get static relative time text
         */
        const timeText = dayjs().add(timeLeft, "milliseconds").fromNow(true);

        /**
         * Format placeholders in message
         */
        ["{until}", "{time}"].forEach((text) => {
          messageString = messageString.replaceAll(text, timeText);
        });

        /**
         * Send message and terminate execution
         */
        return post(arg, messageString);
      }

      _timer.refresh(fromArray);
    } else {
      fromArray = new TimeOutEntry(memberId, guildId, rateValue);
      _timer.add(fromArray);
    }

    return next();
  };
}
