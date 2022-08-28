# @Bot

bot decorator help you manage multiple bot's in single node instance

## Supported with

- [@ButtonComponent](../gui/button-component)
- [@ContextMenu](../gui/context-menu)
- [@On](./on)
- [@Once](./once)
- [@SelectMenuComponent](../gui/select-menu-component)
- [@SimpleCommand](../commands/simple-command)
- [@Slash](../commands/slash)

## Example

```ts
@Discord()
@Bot("alex", "zoe") // Define which bot can run the following commands or events
class Example {
  @SimpleCommand()
  hello(command: SimpleCommandMessage) {
    command.message.reply(`👋 ${message.member}`);
  }
}

const alex = new Client({
  botId: "alex", // define botId
});

const zoe = new Client({
  botId: "zoe", // define botId
});

// We will now build our application to load all the commands/events for both bots.
MetadataStorage.instance.build().then(() => {
  // Now that the app is ready, we can login to both bots
  alex.login("alex token");
  zoe.login("zoe token");
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

[@ButtonComponent](docs/packages/discordx/guides/decorators/gui/button-component)

[@SelectMenuComponent](docs/packages/discordx/guides/decorators/gui/select-menu-component)

[@ContextMenu](docs/packages/discordx/guides/decorators/gui/context-menu)

[@Discord](docs/packages/discordx/guides/decorators/general/discord)

[@On](docs/packages/discordx/guides/decorators/general/on)

[@Once](docs/packages/discordx/guides/decorators/general/once)

[@SimpleCommand](docs/packages/discordx/guides/decorators/command/simple-command)

[@Slash](docs/packages/discordx/guides/decorators/command/slash)
