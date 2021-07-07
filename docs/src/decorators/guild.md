# @Guild

You can specify in which guilds your @Slash commands are created by decorating the method with @Slash and @Guild

```ts
@Discord()
abstract class AppDiscord {
  @Guild("GUILD_ID") // Only created on the guild GUILD_ID
  @Slash("hello")
  private hello() {
    // ...
  }

  @Guild("GUILD_ID", "GUILD_ID2") // Only created on the guild GUILD_ID and GUILD_ID2
  @Slash("bye")
  private bye() {
    // ...
  }
}
```

## Guild at class level

You can set the guild IDs for all @Slash inside the class by decorating the class with @Guild

```ts
@Discord()
@Guild("GUILD_ID", "GUILD_ID2")
class DiscordBot {
  @Slash("hello") // Only created on the guild GUILD_ID and GUILD_ID2
  private hello() {
    // ...
  }

  @Slash("hello2") // Only created on the guild GUILD_ID and GUILD_ID2
  private hello2() {
    // ...
  }
}
```

## Params

`@Guild(...guildIDs: string[])`

### roleIDs

`string[]`  
The guilds IDs list
