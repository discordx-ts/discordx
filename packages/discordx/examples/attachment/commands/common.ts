/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { Attachment, CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

@Discord()
export class Example {
  @Slash({ description: "attachment" })
  attachment(
    @SlashOption({
      description: "image",
      name: "image",
      required: true,
      type: ApplicationCommandOptionType.Attachment,
    })
    attachment: Attachment,
    interaction: CommandInteraction,
  ): void {
    interaction.reply(attachment.url);
  }
}
