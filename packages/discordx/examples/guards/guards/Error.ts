/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { CommandInteraction } from "discord.js";
import type { GuardFunction } from "discordx";

export const ErrorHandler: GuardFunction<CommandInteraction> = async (
  interaction,
  client,
  next,
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
