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

## Make changes to

It either extends or overwrites data configured in below decorators, however, the order of decorators matters.

[@ButtonComponent](/docs/decorators/buttoncomponent)

[@SelectMenuComponent](/docs/decorators/selectmenucomponent)

[@Discord](/docs/decorators/discord)

[@On](/docs/decorators/on)

[@Once](/docs/decorators/once)

[@SimpleCommand](/docs/decorators/simeplcommand)

[@Slash](/docs/decorators/slash)
