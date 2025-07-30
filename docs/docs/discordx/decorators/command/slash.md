---
title: "@Slash"
---

Discord has it's own command system now, you can simply declare commands and use application commands this way

## Signature

```ts
Slash(options: ApplicationCommandOptions<VerifyName<T>, NotEmpty<TD>> | SlashCommandBuilder)
```

## Examples

### Simple usage

```ts
import { Discord, Slash } from "discordx";

@Discord()
class Example {
  @Slash({ description: "hello", name: "hello" })
  hello(interaction: CommandInteraction) {
    // ...
  }
}
```

### Builders

Discord.js's SlashCommandBuilder can also be used in the decorator to define the command.

```ts
import { SlashCommandBuilder } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
class Example {
  @Slash(
    new SlashCommandBuilder().setName("hello").setDescription("Say hello!"),
  )
  hello(interaction: CommandInteraction) {
    // ...
  }
}
```

### Aliases

Slash commands can also have aliases using the SlashWithAliases decorator,
both with the default configuration and builder.

> In these examples, three slash commands will be created: `/hello`, `/hey` and `/hi`.

#### Default configuration

```ts
import { Discord, SlashWithAliases } from "discordx";

@Discord()
class Example {
  @SlashWithAliases({ description: "hello", name: "hello" }, ["hey", "hi"])
  hello(interaction: CommandInteraction) {
    // ...
  }
}
```

#### Builder configuration

```ts
import { SlashCommandBuilder } from "discord.js";
import { Discord, SlashWithAliases } from "discordx";

const command = new SlashCommandBuilder()
  .setName("hello")
  .setDescription("Say hello!");

@Discord()
class Example {
  @SlashWithAliases(command, ["hey", "hi"])
  hello(interaction: CommandInteraction) {
    // ...
  }
}
```

## Initialize client and application commands

It require a bit of configuration at you Client initialization.
You have to manually execute and initialize your application commands by using:

- `client.initApplicationCommands()`
- `client.executeInteraction(interaction)`

This provide flexibility in your code

```ts
import { Client } from "discordx";

async function start() {
  const client = new Client({
    botId: "test",
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
    ],
  });

  client.once("ready", async () => {
    await client.initApplicationCommands();
  });

  client.on("interactionCreate", (interaction) => {
    client.executeInteraction(interaction);
  });

  await client.login("YOUR_TOKEN");
}

start();
```

:::danger
**Global** application commands take time to propagate on discord servers, we recommend to develop on a test server with the **Guild** specific mode

```ts
const client = new Client({
  botId: "test",
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
  botGuilds: process.DEV ? ["GUILD_ID"] : undefined,
});
```

:::

### Clear application commands from Discord cache

You can remove application commands from the Discord cache by using `client.clearApplicationCommands(...guildIds: Snowflake[])`

> If you do not specify the guild id you operate on global application commands

```ts
client.once("ready", async () => {
  await client.clearApplicationCommands();
  await client.clearApplicationCommands("546281071751331840");
  await client.initApplicationCommands();
});
```

### Fetch application commands from Discord

or fetch them by using `client.fetchApplicationCommands(guildId: string)`

> If you do not specify the guild id you operate on global application commands

```ts
client.once("ready", async () => {
  // ...
  const applicationCommands = await client.fetchApplicationCommands();
});
```

### Get declared application commands

You can retrieve the list of declared application commands on your application (declared using @Slash, @ContextMenu)

```ts
const applicationCommands = client.applicationCommands;
```

### Apply application command to specific guild globally

Instead on doing this for all of your @Slash:

> You can manage it by yourself using your own The slashes `Client` API and creating your own `client.initApplicationCommands()` implementation

```ts
@Discord()
class Example {
  @Guild("GUILD_ID")
  @Slash({ description: "hello", name: "hello" })
  hello(interaction: CommandInteraction) {
    // ...
  }

  @Guild("GUILD_ID")
  @Slash({ description: "bye", name: "bye" })
  bye(interaction: CommandInteraction) {
    // ...
  }
}
```

You can do:

```ts
const client = new Client({
  botId: "test",
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
});
```

```ts
@Discord()
class Example {
  @Slash({ description: "hello", name: "hello" }) // Applied on GUILD_ID
  hello(interaction: CommandInteraction) {
    // ...
  }

  @Slash({ description: "bye", name: "bye" }) // Applied on GUILD_ID
  bye(interaction: CommandInteraction) {
    // ...
  }
}
```

## Authorize your bot to use application commands

:::danger
In order to make commands work within a guild, the guild must authorize your application with the `applications.commands` scope. The `bot` scope is not enough. - _**Discord**_
:::

On the Discord's developer portal, select your bot, go to the OAuth2 tab and check the box **bot** AND **applications.commands**

![](../../../../static/img/authorize1.png)
![](../../../../static/img/authorize2.png)

[read more at discord](https://discord.com/developers/docs/interactions/application-commands#authorizing-your-application)

## See also

- [discord.js's documentation](https://discord.js.org)
- [Discord's application command interactions](https://discord.com/developers/docs/interactions/application-commands)
