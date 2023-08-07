# @ButtonComponent

add button interaction handler for your bot using `@ButtonComponent` decorator

Here are some example screenshots:

![](../../../../static/img/button-example.jpg)

## Signature

```ts
ButtonComponent(options: ComponentOptions)
```

:::caution
As per discord latest announcement, `custom_ids` being unique within a message. [read here more](https://discord.com/developers/docs/interactions/message-components#custom-id)
:::

## Example

```ts
@Discord()
class Example {
  @ButtonComponent({ id: "hello" })
  handler(interaction: ButtonInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash({ description: "test" })
  test(interaction: CommandInteraction): void {
    const btn = new ButtonBuilder()
      .setLabel("Hello")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("hello");

    const buttonRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        btn,
      );

    interaction.reply({
      components: [buttonRow],
    });
  }
}
```
