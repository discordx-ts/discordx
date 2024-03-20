/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { CommandInteraction } from "discord.js";
import { Bot, Discord, Slash } from "discordx";

@Discord()
@Bot("botA", "botB") // A bot id is crucial
export class Example {
  @Slash({ description: "shared" })
  shared(interaction: CommandInteraction): void {
    interaction.reply("This is a shared command and can be used by both bots");
  }
}
