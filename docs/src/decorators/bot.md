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
  @Command("hello")
  command(message: Message) {
    message.reply(`👋 ${message.member}`);
  }
}
```
