import { CommandInteraction } from "discord.js";
import { ArgsOf, GuardFunction } from "../../../src";

export const Say = (text: string) => {
  const guard: GuardFunction<ArgsOf<"message"> | CommandInteraction> = async (
    messageOrCommand,
    client,
    next,
    nextObj
  ) => {
    await next();
  };

  return guard;
};
