# @Guild

You can use this guard to specify which guilds your @Slash commands are created by decorating the method with @Slash and @Guild

## Supported with

- [@ButtonComponent](../gui/button-component)
- [@ContextMenu](../gui/context-menu)
- [@SelectMenuComponent](../gui/select-menu-component)
- [@SimpleCommand](../commands/simple-command)
- [@Slash](../commands/slash)

## Example

```ts
@Discord()
class Example {
  @Slash("hello")
  @Guild("GUILD_ID") // Only created on the guild GUILD_ID
  hello() {
    // ...
  }

  @Slash("bye")
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
  @Slash() // Only created on the guild GUILD_ID and GUILD_ID2
  hello() {
    // ...
  }

  @Slash() // Only created on the guild GUILD_ID and GUILD_ID2
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

## Signature

```ts
@Guild(...guildIds: IGuild[])
```

## type: IGuild

```ts IGuild
type IGuild =
  | Snowflake
  | Snowflake[]
  | ((
      client: Client,
      command:
        | DApplicationCommand
        | DComponent
        | SimpleCommandMessage
        | undefined
    ) => Snowflake | Snowflake[] | Promise<Snowflake> | Promise<Snowflake[]>);
```

## Make changes to

It either extends or overwrites data configured in below decorators, however, the order of decorators matters.

[@ButtonComponent](docs/packages/discordx/guides/decorators/gui/button-component)

[@SelectMenuComponent](docs/packages/discordx/guides/decorators/gui/select-menu-component)

[@Discord](docs/packages/discordx/guides/decorators/general/discord)

[@SimpleCommand](docs/packages/discordx/guides/decorators/commands/simple-command)

[@Slash](docs/packages/discordx/guides/decorators/commands/slash)
