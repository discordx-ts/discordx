import { CommandInteraction, Message } from "discord.js";
import { GuardFunction } from "../../../src";

export const Say = (text: string) => {
  // do not use ArgOf it will throw undefined error cause of type error
  const guard: GuardFunction<Message | CommandInteraction> = async (
    messageOrCommand,
    _client,
    next,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _nextObj
  ) => {
    messageOrCommand.channel.send(text);
    await next();
  };

  return guard;
};
