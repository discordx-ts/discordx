import type {
  BaseCommandInteraction,
  MessageComponentInteraction,
} from "discord.js";
import type { GuardFunction } from "discordx";
import { SimpleCommandMessage } from "discordx";

import { TimedSet } from "./utils/TimedSet.js";

class TimeOutEntry {
  public constructor(public userId: string, public guildId: string) {
    // empty constructor
  }
}

export enum TIME_UNIT {
  days = "d",
  hours = "h",
  minutes = "mi",
  seconds = "s",
}

export function RateLimit(
  timeout: TIME_UNIT,
  value: number,
  message = "message being rate limited!"
): GuardFunction<BaseCommandInteraction | SimpleCommandMessage> {
  const convertToMilli = (timeValue: number, unit: TIME_UNIT): number => {
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
  };

  const millis = convertToMilli(value, timeout);
  const _timer = new TimedSet<TimeOutEntry>(millis);

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

    return interaction.reply({
      content,
      ephemeral,
    });
  }

  const getFromArray = (
    userId: string,
    guildId: string
  ): TimeOutEntry | undefined => {
    const arr = _timer.rawSet;
    return arr.find(
      (v: TimeOutEntry) => v.userId === userId && v.guildId === guildId
    );
  };

  const post = async (
    arg: BaseCommandInteraction | SimpleCommandMessage,
    msg: string
  ): Promise<void> => {
    if (arg instanceof SimpleCommandMessage) {
      await arg?.message.reply(msg);
    } else {
      await replyOrFollowUp(arg, msg);
      return;
    }
  };

  return (arg, client, next) => {
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
    if (fromArray && message) {
      return post(arg, message);
    } else {
      fromArray = new TimeOutEntry(memberId, guildId);
      _timer.add(fromArray);
    }

    return next();
  };
}
