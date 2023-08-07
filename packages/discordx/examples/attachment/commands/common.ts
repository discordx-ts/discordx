import type { Attachment, CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";

import { Discord, Slash, SlashOption } from "../../../src/index.js";

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
