import type { CommandInteraction, MessageAttachment } from "discord.js";

import { Discord, Slash, SlashOption } from "../../../src/index.js";

@Discord()
export class Example {
  @Slash("attachment")
  attachment(
    @SlashOption("image", { type: "ATTACHMENT" })
    attachment: MessageAttachment,
    interaction: CommandInteraction
  ): void {
    interaction.reply(attachment.url);
  }
}
