import type { ChatInputCommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";

import { Discord, Slash, SlashOption } from "../../../src/index.js";

class DatabaseDocument {
  constructor(
    public input: string,
    public interaction: ChatInputCommandInteraction
  ) {
    //
  }

  async say(): Promise<void> {
    await this.interaction.followUp(
      `${this.interaction.user} says ${this.input}`
    );
  }
}

function DatabaseTransformer(
  input: string,
  interaction: ChatInputCommandInteraction
): DatabaseDocument {
  return new DatabaseDocument(input, interaction);
}

@Discord()
export class Example {
  @Slash({ description: "test-input-next", name: "test-input-next" })
  async withTransformer(
    @SlashOption({
      description: "input",
      name: "input",
      required: true,
      transformer: DatabaseTransformer,
      type: ApplicationCommandOptionType.String,
    })
    input: DatabaseDocument,
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    await interaction.deferReply();
    input.say();
  }
}
