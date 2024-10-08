/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
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
      await interaction.reply(err.message);
    } else {
      await interaction.reply("unknown error");
    }
  }
};
