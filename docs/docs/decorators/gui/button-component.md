# @Button

add button interaction handler for your bot using `@Button` decorator

Here are some example screenshots:

![](../../../static/img/button-example.jpg)

## Example

```ts
import {
  ButtonInteraction,
  CommandInteraction,
  MessageButton,
  MessageActionRow,
} from "discord.js";
import { ButtonComponent, Discord, Slash } from "discordx";

@Discord()
class buttonExample {
  @Slash("hello")
  async hello(interaction: CommandInteraction) {
    await interaction.deferReply();

    // Create the button, giving it the id: "hello-btn"
    const helloBtn = new MessageButton()
      .setLabel("Hello")
      .setEmoji("👋")
      .setStyle("PRIMARY")
      .setCustomId("hello-btn");

    // Create a MessageActionRow and add the button to that row.
    const row = new MessageActionRow().addComponents(helloBtn);

    interaction.editReply({
      content: "Say hello to bot",
      components: [row],
    });
  }

  // register a handler for the button with id: "hello-btn"
  @ButtonComponent("hello-btn")
  myBtn(interaction: ButtonInteraction) {
    interaction.reply(`👋 ${interaction.member}`);
  }
}
```

## Signature

```ts
ButtonComponent(
  custom_id: string,
  options?: { guilds?: Snowflake[]; botIds?: string[] }
)
```

## Parameters

### custom_id

A unique id for your button interaction to be handled under.

| type   | default       | required |
| ------ | ------------- | -------- |
| string | function name | No       |

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
