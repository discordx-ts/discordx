# @ButtonComponent

add button interaction handler for your bot using `@ButtonComponent` decorator

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

    const helloBtn = new MessageButton()
      .setLabel("Hello")
      .setEmoji("👋")
      .setStyle("PRIMARY")
      .setCustomId("hello-btn");

    const row = new MessageActionRow().addComponents(helloBtn);

    interaction.editReply({
      content: "Say hello to bot",
      components: [row],
    });
  }

  @ButtonComponent("hello-btn")
  mybtn(interaction: ButtonInteraction) {
    interaction.reply(`👋 ${interaction.member}`);
  }
}
```

## Params

`@ButtonComponent("btn-id")`

### btn-id

`string`
The button id for your handling button interaction

# @Bot

bot decorator help you manage multiple bot's in single node instance

```ts
const alexa = new Client({
  botId: "alexa", // define botid under Client
});

const cortana = new Client({
  botId: "cortana", // define botid under Client
});

@Discord()
@Bot("alexa", "cortana") // now define, which bot can execute following slashes, events or commands
class simpleCommandExample {
  @SimpleCommand("hello")
  command(message: Message) {
    message.reply(`👋 ${message.member}`);
  }
}
```
