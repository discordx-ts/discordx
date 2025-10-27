# Client

It manages all the operations between your app and Discord's API using discord.js

## Setup and start your application

In order to start your application, you must use the **discordx**'s Client (not the client that is provided by **discord.js**!).  
It works the same as the **discord.js**'s Client (same methods, properties, ...).

```ts
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
  ],
  silent: false,
});

client.on(Events.ClientReady, async () => {
  console.log(">> Bot started");

  // to create/update/delete discord application commands
  await client.initApplicationCommands();
});

client.login(BOT_TOKEN);
```

## Intents

When you initialize the Client, you must specify the "**intents**" of your bot, which determine what information your bot will receive from the Discord servers, **it's different from the permissions**

_Maintaining a stateful application can be difficult when it comes to the amount of data you're expected to process, especially at scale. Gateway Intents are a system to help you lower that computational burden._

_When identifying to the gateway, you can specify an intents parameter which allows you to conditionally subscribe to pre-defined "intents", groups of events defined by Discord. If you do not specify a certain intent, you will not receive any of the gateway events that are batched into that group._

:::danger
If an event of your app isn't triggered, you probably missed an **Intent**
:::

### Basic intents, just text messages

```ts
import { Events, IntentsBitField } from "discord.js";

const client = new Client({
  botId: "test",
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
  // ...
});
```

### Enable direct messages from user

```ts
import { IntentsBitField, Partials } from "discord.js";

const client = new Client({
  botId: "test",
  // partial configuration required to enable direct messages
  partials: [Partials.Channel, Partials.Message],
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages,
  ],
  // ...
});
```

### Voice activity intent, the ability to speak

```ts
import { Events, IntentsBitField } from "discord.js";

const client = new Client({
  botId: "test",
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GUILD_VOICE_STATES, // Can speak
  ],
  // ...
});
```

## See also

- [discord.js documentation](https://discord.js.org/#/docs/main/stable/class/Intents)
- [Discord's documentation](https://discord.com/developers/docs/topics/gateway#list-of-intents)
