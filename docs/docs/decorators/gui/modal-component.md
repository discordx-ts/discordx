# @ModalComponent

add modal interaction handler for your bot using `@ModalComponent` decorator

Here are some example screenshots:

![](../../../static/img/modal-example.png)

## Example

```ts
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
```

## Signature

```ts
@ModalComponent(custom_id: string | RegExp, options?: { guilds?: Snowflake[]; botIds?: string[] })
```

## Parameters

### custom_id

A unique id for your button interaction to be handled under.

| type             | default       | required |
| ---------------- | ------------- | -------- |
| string \| RegExp | function name | No       |

:::caution
As per discord latest announcement, `custom_ids` being unique within a message. [read here more](https://discord.com/developers/docs/interactions/message-components#custom-id)
:::

### options

Multiple options, check below.

| type   | default   | required |
| ------ | --------- | -------- |
| object | undefined | No       |

#### `botIds`

Array of bot ids, for which only the event will be executed.

| type      | default |
| --------- | ------- |
| string[ ] | [ ]     |

#### `Guilds`

The guilds where the command is created

| type      | default |
| --------- | ------- |
| string[ ] | [ ]     |
