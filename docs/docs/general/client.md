# Client

It manages all the operations between your app and Discord's API using discord.js

## Setup and start your application

In order to start your application, you must use the discord.**ts**'s Client (not the client that is provided by discord.**js**!).  
It works the same as the discord.**js**'s Client (same methods, properties, ...).

### intents

[see Intents](#list-of-all-the-intents)

| type       | default | required |
| ---------- | ------- | -------- |
| Intents[ ] |         | Yes      |

### botId

a bot id, help you manage your bot interactions, events (this is important in case there are more than one bot running in single instance)

| type   | default | required |
| ------ | ------- | -------- |
| string | bot     | No       |

### prefix

simple commands use this prefix by default, use function to fetch different prefix for different guilds

| type                                                | default | required |
| --------------------------------------------------- | ------- | -------- |
| string \| ((message: Message) =\> Promise<string\>) | !       | No       |

### commandUnauthorizedHandler

define bot reply, when command is not authorized

| type                                                           | default | required |
| -------------------------------------------------------------- | ------- | -------- |
| string \| ((command: SimpleCommandMessage) =\> Promise<void\>) |         | No       |

### silent

Allows you to disable your event information at startup

| type    | default | required |
| ------- | ------- | -------- |
| boolean | true    | No       |

### guards

Global guards, it's an array of functions

| type              | default | required |
| ----------------- | ------- | -------- |
| GuardFunction [ ] | [ ]     | No       |

### botGuilds

The application commands are executed only on this list of guilds by default, ex. slash, button, select-menu, context-menu

| type       | default | required |
| ---------- | ------- | -------- |
| IGuild [ ] | [ ]     | No       |

## Intents

When you initialize the Client, you must specify the "**intents**" of your bot, which determine what information your bot will receive from the Discord servers, **it's different from the permissions**

_Maintaining a stateful application can be difficult when it comes to the amount of data you're expected to process, especially at scale. Gateway Intents are a system to help you lower that computational burden._

_When identifying to the gateway, you can specify an intents parameter which allows you to conditionally subscribe to pre-defined "intents", groups of events defined by Discord. If you do not specify a certain intent, you will not receive any of the gateway events that are batched into that group._

:::danger
If an event of your app isn't triggered, you probably missed an **Intent**
:::

### Basic intents, just text messages

```ts
import { IntentsBitField } from "discord.js";

const client = new Client({
  botId: "test",
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
  // ...
});
```

### Enable direct messages from user

```ts
import { IntentsBitField } from "discord.js";

const client = new Client({
  botId: "test",
  // partial configuration required to enable direct messages
  partials: ["CHANNEL", "MESSAGE"],
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
import { IntentsBitField } from "discord.js";

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

### List of all the intents

[You can find the complete list here](https://discord.com/developers/docs/topics/gateway#list-of-intents)

**Most used ones**

- GUILDS
- GUILD_MEMBERS
- GUILD_BANS
- GUILD_EMOJIS_AND_STICKERS
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
import { IntentsBitField } from "discord.js";

const client = new Client({
  botId: "test",
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GUILD_VOICE_STATES,
    IntentsBitField.Flags.GUILD_EMOJIS_AND_STICKERS,
    IntentsBitField.Flags.DIRECT_MESSAGE_REACTIONS,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.DIRECT_MESSAGE_TYPING,
    IntentsBitField.Flags.GUILD_INTEGRATIONS,
    IntentsBitField.Flags.GUILD_PRESENCES,
    IntentsBitField.Flags.GUILD_WEBHOOKS,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GUILD_INVITES,
    IntentsBitField.Flags.GUILD_BANS,
  ],
  // ...
});
```

## See also

- [Discord.js documentation](https://discord.js.org/#/docs/main/stable/class/Intents)
- [Discord's documentation](https://discord.com/developers/docs/topics/gateway#list-of-intents)
