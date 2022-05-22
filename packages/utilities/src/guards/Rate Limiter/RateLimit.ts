import type {
  BaseCommandInteraction,
  MessageComponentInteraction,
} from "discord.js";
import type { GuardFunction } from "discordx";
import { SimpleCommandMessage } from "discordx";

import { TIME_UNIT, TimedSet } from "./index.js";
import { TimeOutEntry } from "./logic/index.js";

/**
 * Rate limit this command, specify the time unit and the value and optionally the threshold and the message
 * to post when someone calls the command within the rate limit
 *
 * @param timeout - the time unit to use
 * @param value - the value for the time unit
 * @param message - the message to post when a command is called when the
 * user is in rate limit, defaults = "message being rate limited!, please try again at {until}".
 * use the placeholder {until} in your string to get the time you can next call it `<t:epoch:T>`
 * If a function is supplied, it will pass both the interaction and how many milliseconds are left until the rate limit is over
 * @param rateValue - the value to specify how many messages can be called before it is rate limited, defaults to 1
 *
 * @constructor
 */
export function RateLimit<
  T extends BaseCommandInteraction | SimpleCommandMessage
>(
  timeout: TIME_UNIT,
  value: number,
  message:
    | ((interaction: T, timeLeft: number) => Promise<string> | string)
    | string = "message being rate limited!, please try again at {until}",
  rateValue = 1
): GuardFunction<T> {
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
    interaction: BaseCommandInteraction | MessageComponentInteraction,
    content: string,
    ephemeral = false
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
    guildId: string
  ): TimeOutEntry | undefined {
    const arr = _timer.rawSet;
    return arr.find(
      (v: TimeOutEntry) => v.userId === userId && v.guildId === guildId
    );
  }

  function getTimeLeft(item: TimeOutEntry): number {
    return _timer.getTimeRemaining(item);
  }

  async function post(
    arg: BaseCommandInteraction | SimpleCommandMessage,
    msg: string
  ): Promise<void> {
    if (arg instanceof SimpleCommandMessage) {
      await arg?.message.reply(msg);
    } else {
      return replyOrFollowUp(arg, msg);
    }
  }

  return async function (arg, client, next) {
    let memberId: string | null | undefined;
    let guildId: string | null;

    if (arg instanceof SimpleCommandMessage) {
      memberId = arg?.message?.member?.id;
      guildId = arg?.message?.guildId;
    } else {
      memberId = arg?.member?.user?.id;
      guildId = arg?.guildId;
    }

    if (!memberId || !guildId) {
      return next();
    }

    let fromArray = getFromArray(memberId, guildId);
    if (fromArray) {
      fromArray.incrementCallCount();
      const timeLeft = getTimeLeft(fromArray);
      const whenWillExecute = Date.now() + timeLeft;
      if (fromArray.hasLimitReached()) {
        const messageString =
          typeof message === "function"
            ? await message(arg, timeLeft)
            : message;
        if (messageString.includes("{until}")) {
          return post(
            arg,
            messageString.replaceAll(
              "{until}",
              `<t:${Math.round(whenWillExecute / 1000)}:T>`
            )
          );
        }
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
