# @Slash - Discord commands
Discord has it's own command system now, you can simply declare commands and use Slash commands this way

```ts
import { Discord, Slash } from "@typeit/discord";

@Discord()
abstract class AppDiscord {
  @Slash("hello")
  private hello(
  ) {
    // ...
  }
}
```

## Initialize Client and Slash Commands

It require a bit of configuration at you Client initialization.
You have to manualy execute and initialize your Slash commands by using:
- `client.initSlashes()`
- `client.executeSlash(interaction)`

This provide flexibility in your code

```ts
import { Client } from "@typeit/discord";

async function start() {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
    ],
  });

  client.once("ready", async () => {
    await client.initSlashes();
  });

  client.on("interaction", (interaction) => {
    client.executeSlash(interaction);
  });

  await client.login("YOUR_TOKEN");
}

start();
```

## Slash API
By using the Client class you can access and manage to Slashes

### Clear slashes from Discord cache
You can remove Slash commands from the Discord cache by using `client.clearSlashes(...guildIDs: string[])`

> If you do not specify the guild id you operate on global Slash commands

```ts
client.once("ready", async () => {
  await client.clearSlashes();
  await client.clearSlashes("546281071751331840");
  await client.initSlashes();
});
```

### Fetch slashes from Discord
or fetch them by using `client.fetchSlashes(guildID: string)`
> If you do not specify the guild id you operate on global Slash commands

```ts
client.once("ready", async () => {
  // ...
  const slashes = await client.fetchSlashes();
});
```

### Get declared slashes
You can retrieve the list of declared Slashes on your application (declared using @Slash)
```ts
const slashes = client.slashes;
```

### Apply Slash to specific guild globaly
Instead on doing this for all of your @Slash:

> You can manage it by yourself using your own the Slashes `Client` API and creating your own `client.initSlashes()` implementation

```ts
@Discord()
abstract class AppDiscord {
  @Guild("GUILD_ID")
  @Slash("hello")
  private hello(
  ) {
    // ...
  }

  @Guild("GUILD_ID")
  @Slash("bye")
  private bye(
  ) {
    // ...
  }
}
```

You can do:

```ts
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
  slashGuilds: ["GUILD_ID"]
});
```
```ts
@Discord()
abstract class AppDiscord {
  @Slash("hello") // Applied on GUILD_ID
  private hello(
  ) {
    // ...
  }

  @Slash("bye") // Applied on GUILD_ID
  private bye(
  ) {
    // ...
  }
}
```
