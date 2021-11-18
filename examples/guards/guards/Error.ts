import { CommandInteraction } from "discord.js";
import { GuardFunction } from "../../../build/cjs/index.cjs";

export const ErrorHandler: GuardFunction<CommandInteraction> = async (
  interaction,
  client,
  next
) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof Error) {
      interaction.reply(err.message);
    } else {
      interaction.reply("unknown error");
    }
  }
};
