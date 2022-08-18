import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";

import {
  Discord,
  Slash,
  SlashChoice,
  SlashOption,
} from "../../../src/index.js";

@Discord()
export class Example {
  @Slash({ name: "choice-test" })
  min(
    @SlashChoice({ name: "alex", value: "alex" })
    @SlashChoice({ name: "mike", value: "mike" })
    @SlashOption({
      name: "input",
      type: ApplicationCommandOptionType.String,
    })
    input: string,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${input}`);
  }
}
