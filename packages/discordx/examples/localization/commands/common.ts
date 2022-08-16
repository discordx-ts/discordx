import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";

import { Discord, Slash, SlashOption } from "../../../src/index.js";

@Discord()
export class Example {
  @Slash({
    description: "say hello",
    nameLocalizations: {
      "en-GB": "hello-x",
    },
  })
  hello(
    @SlashOption({
      name: "message",
      type: ApplicationCommandOptionType.String,
    })
    message: string,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${message}`);
  }
}
