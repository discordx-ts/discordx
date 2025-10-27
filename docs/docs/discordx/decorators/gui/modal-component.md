# @ModalComponent

add modal interaction handler for your bot using `@ModalComponent` decorator

Here are some example screenshots:

![](../../../../static/img/modal-example.png)

## Signature

```ts
@ModalComponent(options: ComponentOptions)
```

## Example

```ts
@Discord()
class Example {
  @Slash({ description: "modal" })
  modal(interaction: CommandInteraction): void {
    // Create the modal
    const modal = new ModalBuilder()
      .setTitle("My Awesome Form")
      .setCustomId("AwesomeForm");

    // Create text input fields
    const tvShowInputComponent = new LabelBuilder()
      .setLabel("Favorite TV show")
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId("tvField")
          .setStyle(TextInputStyle.Short)
          .setRequired(true),
      );

    const haikuInputComponent = new LabelBuilder()
      .setLabel("Write down your favorite haiku")
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId("haikuField")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true),
      );

    // Add action rows to form
    modal.addLabelComponents(tvShowInputComponent, haikuInputComponent);

    // --- snip ---

    // Present the modal to the user
    interaction.showModal(modal);
  }

  @ModalComponent()
  async AwesomeForm(interaction: ModalSubmitInteraction): Promise<void> {
    const [favTVShow, favHaiku] = ["tvField", "haikuField"].map((id) =>
      interaction.fields.getTextInputValue(id),
    );

    await interaction.reply(
      `Favorite TV Show: ${favTVShow}, Favorite haiku: ${favHaiku}`,
    );

    return;
  }
}
```
