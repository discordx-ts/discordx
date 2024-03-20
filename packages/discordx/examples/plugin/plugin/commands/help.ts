/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Example {
  @Slash({
    description: "help command",
    name: "help",
  })
  help(interaction: CommandInteraction): void {
    interaction.reply("I am help command xd.");
  }
}
