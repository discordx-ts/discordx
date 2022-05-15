import type {
  CommandInteraction,
  ModalActionRowComponent,
  ModalSubmitInteraction,
} from "discord.js";
import { MessageActionRow, Modal, TextInputComponent } from "discord.js";

import { Discord, ModalComponent, Slash } from "../../../src/index.js";

@Discord()
export class Example {
  @Slash("modal")
  attachment(interaction: CommandInteraction): void {
    // Create the modal
    const modal = new Modal()
      .setTitle("My Awesome Form")
      .setCustomId("AwesomeForm");

    // Create text input fields
    const tvShowInputComponent = new TextInputComponent()
      .setCustomId("tvField")
      .setLabel("Favorite TV show")
      .setStyle("SHORT");

    const haikuInputComponent = new TextInputComponent()
      .setCustomId("haikuField")
      .setLabel("Write down your favorite haiku")
      .setStyle("PARAGRAPH");

    const row1 = new MessageActionRow<ModalActionRowComponent>().addComponents(
      tvShowInputComponent
    );

    const row2 = new MessageActionRow<ModalActionRowComponent>().addComponents(
      haikuInputComponent
    );

    // Add action rows to form
    modal.addComponents(row1, row2);

    // --- snip ---

    // Present the modal to the user
    interaction.showModal(modal);
  }

  @ModalComponent("AwesomeForm")
  async handle(interaction: ModalSubmitInteraction): Promise<void> {
    const [favTVShow, favHaiku] = ["tvField", "haikuField"].map((id) =>
      interaction.fields.getTextInputValue(id)
    );

    await interaction.reply(
      `Favorite TV Show: ${favTVShow}, Favorite haiku: ${favHaiku}`
    );

    return;
  }
}
