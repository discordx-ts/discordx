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
- `client.executeInteraction(interaction)`

This provide flexibility in your code

```ts
import { Client } from "@typeit/discord";

async function start() {
  const client = new Client({
    botId: "test",
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
    ],
  });

  client.once("ready", async () => {
    await client.initSlashes();
  });

  client.on("interactionCreate", (interaction) => {
    client.executeInteraction(interaction);
  });

  await client.login("YOUR_TOKEN");
}

start();
```

::: danger
**Global** slash commands take time to propagate on discord servers, we recommend to develop on a test server with the **Guild** specific mode

```ts
const client = new Client({
  botId: "test",
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
  slashGuilds: process.DEV ? ["GUILD_ID"] : undefined
});
```
:::

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
  botId: "test",
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

## Params

### Name
`string`  
The Slash command name

### Description
`string`  
The Slash command description

### Guilds
`string[]`   
The guilds where the command is created

### defaultPermission
`boolean`  
`true` by default     
"You can also set a default_permission on your commands if you want them to be disabled by default when your app is added to a new guild. Setting default_permission to false will disallow anyone in a guild from using the command--even Administrators and guild owners--unless a specific overwrite is configured. It will also disable the command from being usable in DMs."

## Authorize your bot to use Slash commands
On the Discord's developer portal, select your bot, go to the OAuth2 tab and check the box **bot** AND **applications.commands**

![](/discord.ts/authorize1.png)
![](/discord.ts/authorize2.png)

## See also
- [discord.js's documentation with Interactions (Slash commands)](https://discord.js.org/#/docs/main/master/general/welcome)
- [Discord's Slash commands interactions](https://discord.com/developers/docs/interactions/slash-commands)
