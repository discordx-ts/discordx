/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { CommandInteraction } from "discord.js";
import { Bot, Discord, Slash } from "discordx";

@Discord()
@Bot("botA") // A bot id is crucial
export class Example {
  @Slash({ description: "hello" })
  hello(interaction: CommandInteraction): void {
    interaction.reply("I am bot A.");
  }
}
