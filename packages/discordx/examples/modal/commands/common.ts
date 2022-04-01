import type {
  CommandInteraction,
  ModalActionRowComponent,
  ModalSubmitInteraction,
} from "discord.js";
import {
  ActionRow,
  Modal,
  TextInputComponent,
  TextInputStyle,
} from "discord.js";

import { Discord, ModalComponent, Slash } from "../../../src/index.js";

@Discord()
export abstract class AppDiscord {
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
      .setStyle(TextInputStyle.Short);

    const haikuInputComponent = new TextInputComponent()
      .setCustomId("haikuField")
      .setLabel("Write down your favorite haiku")
      .setStyle(TextInputStyle.Paragraph);

    const rows = [tvShowInputComponent, haikuInputComponent].map((component) =>
      new ActionRow<ModalActionRowComponent>().addComponents(component)
    );

    // Add action rows to form
    modal.addComponents(...rows);

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
