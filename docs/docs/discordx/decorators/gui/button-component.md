# @ButtonComponent

add button interaction handler for your bot using `@ButtonComponent` decorator

Here are some example screenshots:

![](../../../../static/img/button-example.jpg)

## Example

```ts
@Discord()
class Example {
  @ButtonComponent({ id: "hello" })
  handler(interaction: ButtonInteraction): void {
    interaction.reply(":wave:");
  }

  @Slash()
  test(interaction: CommandInteraction): void {
    const btn = new ButtonBuilder()
      .setLabel("Hello")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("hello");

    const buttonRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        btn
      );

    interaction.reply({
      components: [buttonRow],
    });
  }
}
```

## Signature

```ts
ButtonComponent(options: ComponentOptions)
```

## Parameters

### options

The button options

| type             | default   | required |
| ---------------- | --------- | -------- |
| ComponentOptions | undefined | NO       |

## Type: ComponentOptions

### botIds

Array of bot ids, for which only the event will be executed.

| type      | default |
| --------- | ------- |
| string[ ] | [ ]     |

### Guilds

The guilds where the command is created

| type      | default |
| --------- | ------- |
| string[ ] | [ ]     |

### id

A unique id for your button interaction to be handled under.

| type             | default       | required |
| ---------------- | ------------- | -------- |
| string \| RegExp | function name | No       |

:::caution
As per discord latest announcement, `custom_ids` being unique within a message. [read here more](https://discord.com/developers/docs/interactions/message-components#custom-id)
:::
