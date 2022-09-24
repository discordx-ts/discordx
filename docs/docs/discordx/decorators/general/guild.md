# @Guild

You can use this guard to specify which guilds your @Slash commands are created by decorating the method with @Slash and @Guild

## Signature

```ts
@Guild(...guildIds: IGuild[])
```

## Supported with

- [@ButtonComponent](../gui/button-component)
- [@ContextMenu](../gui/context-menu)
- [@SelectMenuComponent](../gui/select-menu-component)
- [@SimpleCommand](../command/simple-command)
- [@Slash](../command/slash)

## Example

```ts
@Discord()
class Example {
  @Slash({ description: "hello" })
  @Guild("GUILD_ID") // Only created on the guild GUILD_ID
  hello() {
    // ...
  }

  @Slash({ description: "bye" })
  @Guild("GUILD_ID", "GUILD_ID2") // Only created on the guild GUILD_ID and GUILD_ID2
  bye() {
    // ...
  }
}
```

## Guild at class level

You can set the guild IDs for all @Slash inside the class by decorating the class with @Guild

```ts
@Discord()
@Guild("GUILD_ID", "GUILD_ID2")
class Example {
  @Slash({ description: "hello" }) // Only created on the guild GUILD_ID and GUILD_ID2
  hello() {
    // ...
  }

  @Slash({ description: "hello 2" }) // Only created on the guild GUILD_ID and GUILD_ID2
  hello2() {
    // ...
  }
}
```

## Example - Dynamic guild resolver

To provide dynamic guild lists, use guild resolver.

```ts
this._client = new Client({
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
});
```

## Make changes to

It either extends or overwrites data configured in below decorators, however, the order of decorators matters.

[@ButtonComponent](docs/discordx/decorators/gui/button-component)

[@SelectMenuComponent](docs/discordx/decorators/gui/select-menu-component)

[@Discord](docs/discordx/decorators/general/discord)

[@SimpleCommand](docs/discordx/decorators/command/simple-command)

[@Slash](docs/discordx/decorators/command/slash)
