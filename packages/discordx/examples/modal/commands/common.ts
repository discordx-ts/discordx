/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  type CommandInteraction,
  type ModalSubmitInteraction,
} from "discord.js";
import { Discord, ModalComponent, Slash } from "discordx";

@Discord()
export class Example {
  @Slash({ description: "modal" })
  async modal(interaction: CommandInteraction): Promise<void> {
    // Create the modal
    const modal = new ModalBuilder()
      .setTitle("My Awesome Form")
      .setCustomId("AwesomeForm");

    // Create text input fields
    const tvShowInputComponent = new TextInputBuilder()
      .setCustomId("tvField")
      .setLabel("Favorite TV show")
      .setStyle(TextInputStyle.Short);

    const haikuInputComponent = new TextInputBuilder()
      .setCustomId("haikuField")
      .setLabel("Write down your favorite haiku")
      .setStyle(TextInputStyle.Paragraph);

    const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(
      tvShowInputComponent,
    );

    const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(
      haikuInputComponent,
    );

    // Add action rows to form
    modal.addComponents(row1, row2);

    // --- snip ---

    // Present the modal to the user
    await interaction.showModal(modal);
  }

  @ModalComponent()
  async AwesomeForm(interaction: ModalSubmitInteraction): Promise<void> {
    const [favTVShow, favHaiku] = ["tvField", "haikuField"].map((id) =>
      interaction.fields.getTextInputValue(id),
    );

    await interaction.reply(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      `Favorite TV Show: ${favTVShow!}, Favorite haiku: ${favHaiku!}`,
    );

    return;
  }
}
