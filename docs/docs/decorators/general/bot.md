# @Bot

bot decorator help you manage multiple bot's in single node instance

```ts
const alexa = new Client({
  botId: "alexa", // define botid under Client
});
await alexa.login('alexatoken');

const cortana = new Client({
  botId: "cortana", // define botid under Client
});
await cortana.login('cortanatoken');

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

[@ButtonComponent](/docs/decorators/gui/buttoncomponent)

[@SelectMenuComponent](/docs/decorators/gui/selectmenucomponent)

[@ContextMenu](/docs/decorators/gui/contextmenu)

[@Discord](/docs/decorators/general/discord)

[@On](/docs/decorators/general/on/breaktest)

[@Once](/docs/decorators/general/once)

[@SimpleCommand](/docs/decorators/commands/simplecommand)

[@Slash](/docs/decorators/commands/slash)
