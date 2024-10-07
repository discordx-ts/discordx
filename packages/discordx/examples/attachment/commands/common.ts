/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { Attachment, CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

@Discord()
export class Example {
  @Slash({ description: "attachment" })
  async attachment(
    @SlashOption({
      description: "image",
      name: "image",
      required: true,
      type: ApplicationCommandOptionType.Attachment,
    })
    attachment: Attachment,
    interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.reply(attachment.url);
  }
}
