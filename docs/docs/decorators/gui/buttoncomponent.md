# @ButtonComponent

add button interaction handler for your bot using `@ButtonComponent` decorator

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
    await interaction.defer();

    // Create the button, giving it the ID: "hello-btn"
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

  // register a handler for the button with ID: "hello-btn"
  @ButtonComponent("hello-btn")
  mybtn(interaction: ButtonInteraction) {
    interaction.reply(`👋 ${interaction.member}`);
  }
}
```

## Signature

```ts
ButtonComponent(
  custom_id: string,
  params?: { guilds?: Snowflake[]; botIds?: string[] }
)
```

## Parameters

### custom_id

`string`
A unique id for your button interaction to be handled under.

:::caution
As per discord latest annoucement, `custom_ids` being unique within a message. [read here more](https://discord.com/developers/docs/interactions/message-components#custom-id)
:::

### params

`object`

Multiple options, check below.

#### botIds

`string[]`

Array of bot ids, for which only the event will be executed.

#### Guilds

`string[]`
The guilds where the command is created
