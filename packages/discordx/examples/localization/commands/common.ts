import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";

import { Discord, Slash, SlashOption } from "../../../src/index.js";

@Discord()
export class Example {
  @Slash("hello", {
    defaultPermission: false,
    description: "say hello",
    nameLocalizations: {
      "en-GB": "hello-x",
    },
  })
  voiceChannel(
    @SlashOption("message", {
      type: ApplicationCommandOptionType.String,
    })
    message: string,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${message}`);
  }
}
