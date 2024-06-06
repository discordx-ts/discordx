/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

@Discord()
export class Example {
  @Slash({
    description: "say hello",
    nameLocalizations: {
      "en-GB": "hello-x",
    },
  })
  async hello(
    @SlashOption({
      description: "message",
      name: "message",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    message: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.reply(`${message}`);
  }
}
