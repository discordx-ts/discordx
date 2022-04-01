import type { CommandInteraction, MessageAttachment } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";

import { Discord, Slash, SlashOption } from "../../../src/index.js";

@Discord()
export abstract class AppDiscord {
  @Slash("attachment")
  attachment(
    @SlashOption("image", { type: ApplicationCommandOptionType.Attachment })
    attachment: MessageAttachment,
    interaction: CommandInteraction
  ): void {
    interaction.reply(attachment.url);
  }
}
