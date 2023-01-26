import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";

import { Discord, Slash, SlashOption } from "../../../src/index.js";

class DatabaseDocument {
  constructor(public input: string) {
    //
  }

  toUppercase(): string {
    return this.input.toUpperCase();
  }
}

function DatabaseTransformer(input: string): DatabaseDocument {
  return new DatabaseDocument(input);
}

@Discord()
export class Example {
  @Slash({ description: "test-input", name: "test-input" })
  normal(
    @SlashOption({
      description: "input",
      name: "input",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    input: string,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${input}`);
  }

  @Slash({ description: "test-input-next", name: "test-input-next" })
  withTransformer(
    @SlashOption({
      description: "input",
      name: "input",
      required: true,
      transformer: DatabaseTransformer,
      type: ApplicationCommandOptionType.String,
    })
    input: DatabaseDocument,
    interaction: CommandInteraction
  ): void {
    interaction.reply(input.toUppercase());
  }
}
