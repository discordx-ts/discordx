# @Bot

bot decorator help you manage multiple bot's in single node instance

## Signature

```ts
Bot(...botIDs: string[]): ClassMethodDecorator;
```

## Supported with

- [@ButtonComponent](../gui/button-component)
- [@ContextMenu](../gui/context-menu)
- [@On](./on)
- [@Once](./once)
- [@SelectMenuComponent](../gui/select-menu-component)
- [@SimpleCommand](../command/simple-command)
- [@Slash](../command/slash)

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

## Make changes to

It either extends or overwrites data configured in below decorators, however, the order of decorators matters.

[@ButtonComponent](docs/discordx/decorators/gui/button-component)

[@SelectMenuComponent](docs/discordx/decorators/gui/select-menu-component)

[@ContextMenu](docs/discordx/decorators/gui/context-menu)

[@Discord](docs/discordx/decorators/general/discord)

[@On](docs/discordx/decorators/general/on)

[@Once](docs/discordx/decorators/general/once)

[@SimpleCommand](docs/discordx/decorators/command/simple-command)

[@Slash](docs/discordx/decorators/command/slash)
