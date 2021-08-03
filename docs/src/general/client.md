# Client

It manage all the operations between your app, Discord's API and discord.js

## Setup and start your application

In order to start your application, you must use the discord.**ts**'s Client (not the client that is provided by discord.**js**!).  
It works the same as the discord.**js**'s Client (same methods, properties, ...).

- **`intents` (required)**  
  `Intents[]`
  [see Intents](#intents)

- **`botId`**  
  `string` (`bot` by default)
  a bot id, help you manage your bot interactions, events (this is important in case there are more than one bot running in single instance)

- **`prefix`**  
  `string | ((message: Message) => Promise<string>)` (`!` by default)
  simple commands use use this prefix by default, use function to fetch different prefix for different guilds

- **`classes`**
  `string[]`
  Indicate the class jacket of your classes containing the `@Discord` decorator. It accepts a list of classes or of (glob) paths

- **`silent`**
  `boolean` (`true` by default)  
  Allows you to disable your event information at startup

- **`requiredByDefault`**  
  `boolean` (`false` by default)  
  The `@SlashOption` are required by default

- **`guards`**  
  `GuardFunction[]`
  Global guards, it's an array of functions

- **`slashGuilds`**  
  `Snowflake[]`
  The slash commands are executed only on this list of guilds by default

**You must specify the glob path(s) where your decorated classes are**

```ts
import "reflect-metadata";
import { Intents } from "discord.js";
// Use the Client that are provided by discordx NOT discord.js
import { Client } from "discordx";

async function start() {
  const client = new Client({
    botId: "test",
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    classes: [
      `${__dirname}/*Discord.ts`, // glob string to load the classes
      `${__dirname}/*Discord.js`, // If you compile using "tsc" the file extension change to .js
    ],
    silent: false,
  });

  await client.login("YOUR_TOKEN");
}

start();
```

## Intents

You must specify the "**intents**" of your bot when you initialize the Client, it specify which informations your bot receive from the Discord's servers, **it's different from the permissions**

_Maintaining a stateful application can be difficult when it comes to the amount of data you're expected to process, especially at scale. Gateway Intents are a system to help you lower that computational burden._

_When identifying to the gateway, you can specify an intents parameter which allows you to conditionally subscribe to pre-defined "intents", groups of events defined by Discord. If you do not specify a certain intent, you will not receive any of the gateway events that are batched into that group._

::: danger
If an event of your app isn't triggered, you probably missed an Intent
:::

### Basic intents, just text messages

```ts
import { Intents } from "discord.js";

const client = new Client({
  botId: "test",
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  // ...
});
```

### Voice activity intent, the ability to speak

```ts
import { Intents } from "discord.js";

const client = new Client({
  botId: "test",
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES, // Can speak
  ],
  // ...
});
```

### List of all the intents

[You can find the complete list here](https://discord.com/developers/docs/topics/gateway#list-of-intents)

**Most used ones**

- GUILDS
- GUILD_MEMBERS
- GUILD_BANS
- GUILD_EMOJIS
- GUILD_INTEGRATIONS
- GUILD_WEBHOOKS
- GUILD_INVITES
- GUILD_VOICE_STATES
- GUILD_PRESENCES
- GUILD_MESSAGES
- GUILD_MESSAGE_REACTIONS
- GUILD_MESSAGE_TYPING
- DIRECT_MESSAGES
- DIRECT_MESSAGE_REACTIONS
- DIRECT_MESSAGE_TYPING

```ts
import { Intents } from "discord.js";

const client = new Client({
  botId: "test",
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_EMOJIS,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_BANS,
  ],
  // ...
});
```

## Slashes API

It also implements an [API for your @Slash](/decorators/slash.html#slash-api)

## See also

- [discord.js documentation](https://discord.js.org/#/docs/main/stable/class/Intents)
- [Discord's documentation](https://discord.com/developers/docs/topics/gateway#list-of-intents)
