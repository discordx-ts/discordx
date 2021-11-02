# @Bot

bot decorator help you manage multiple bot's in single node instance

```ts
@Discord()
@Bot("alexa", "cortana") // Define which bot can run the following commands or events
class simpleCommandExample {
  @SimpleCommand("hello")
  command(command: SimpleCommandMessage) {
    command.message.reply(`👋 ${message.member}`);
  }
}

const alexa = new Client({
  // Here, we won't define classes, see below
  botId: "alexa", // define botid
});

const cortana = new Client({
  // Here, we won't define classes, see below
  botId: "cortana", // define botidF
});

// We will now build our application to load all the commands/events for both bots.
MetadataStorage.instance
  .build([
    // Whenever this method is used to create an app manually, any predefined classes will be overwritten
    `${__dirname}/alexa/*.{js,ts}`,
    `${__dirname}/cortana/*.{js,ts}`,
  ])
  .then(() => {
    // Now that the app is ready, we can login to both bots
    alexa.login("alexa token");
    cortana.login("cortana token");
  });
```

## Signature

```ts
Bot(...botIDs: string[]): ClassMethodDecorator;
```

## Parameters

### botID

Array of bot ids, for which only the below statement will be executed.

| type      | default | required |
| --------- | ------- | -------- |
| string[ ] | [ ]     | Yes      |

## Make changes to

It either extends or overwrites data configured in below decorators, however, the order of decorators matters.

[@ButtonComponent](/docs/decorators/gui/buttoncomponent)

[@SelectMenuComponent](/docs/decorators/gui/selectmenucomponent)

[@ContextMenu](/docs/decorators/gui/contextmenu)

[@Discord](/docs/decorators/general/discord)

[@On](/docs/decorators/general/on)

[@Once](/docs/decorators/general/once)

[@SimpleCommand](/docs/decorators/commands/simplecommand)

[@Slash](/docs/decorators/commands/slash)
