# discord.ts (typeit/discord)
Create your discord bot using TypeScript and decorators!  
This module is built on `discord.js`, so the internal behavior (methods, properties, ...) is the same.  

**[Join the Discord](https://discord.gg/VDjwu8E)**

## Installation
Use `npm` or `yarn` to install `typeit/discord` with the peer dependecies (`discord.js`):
```sh
npm i @typeit/discord discord.js
```

you must install `reflect-metadata` for the decorators and import it at your entry point
```sh
npm i reflect-metadata
```
```typescript
import "reflect-metadata";

// start ...
```

Your tsconfig.json should looks like that :
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2017",
    "noImplicitAny": false,
    "sourceMap": true,
    "outDir": "build",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "declaration": true,
    "importHelpers": true,
    "forceConsistentCasingInFileNames": true,
    "lib": [
      "es2017",
      "esnext.asynciterable"
    ],
    "moduleResolution": "node"
  },
  "exclude": [
    "node_modules"
  ]
}
```

## Getting started
So we start with an empty class (abstract is not necessary but this is more type-safe, the class shouldn't be initialized)
```typescript
abstract class AppDiscord {
}
```

Then you must declare it as a Discord app class with the `@Discord` decorator :

```typescript
import { Discord } from "@typeit/discord";

@Discord() // Decorate the class
abstract class AppDiscord {
}
```

We can now declare methods that will be executed whenever a Discord event is triggered.  
Our methods must be decorated with the `@On(event: string)` or `@Once(event: string)` decorator.  
When the event is triggered, the method is called and we receive values (in arguments) related to the event.
Here, we receive the message instance (details below) :

```typescript
import { Discord, On } from "@typeit/discord";

@Discord()
abstract class AppDiscord {
  @On("message")
  private onMessage(message: Message) {
    // ...
  }
}
```

## Start your application
In order to start your application, you must use the DiscordTS `Client` (not the client that is provided by discord.js!).  
It works the same as the discord.js's Client (same methods, properties, ...) but the `login` method is overriden and you can set the `silent` property (in the `Client` initialization) in order to not log anything in the console.
```typescript
// Use the Client that are provided by @typeit/discord NOT discord.js
import { Client } from "@typeit/discord";

function start() {
  const client = new Client();
  client.login(
    "YOUR_TOKEN",
    `${__dirname}/*Discord.ts` // glob string to load the classes
  );
}

start();
```

## Client payload injection
You also receive, always as the last payload, the client instance :
```typescript
import {
  Discord,
  On,
  Client
} from "@typeit/discord";
import { Message } from "discord.js";

@Discord()
abstract class AppDiscord {
  @On("message")
  private onMessage(
    message: Message,
    client: Client // Client instance injected here
  ) {
    // ...
  }
}
```

## Commands
You can simply use the `@Command` and `@CommandNotFound` decorators to implement a command system in your app.  

When you use the `@Command` or the `@CommandNotFound` decorator you should type your first parameters as a `CommandMessage`. It provides the command parameters, the prefix, and the command (specified [here](https://github.com/OwenCalvin/discord.ts/blob/master/src/Types/CommandMessage.ts)).  

```typescript
import {
  Discord,
  On,
  Client,
  Command,
  CommandMessage
} from "@typeit/discord";

@Discord({ prefix: "!" })
abstract class AppDiscord {
  @Command("hello")
  private hello(
    message: CommandMessage,
    client: Client
  ) {
    // ...
  }

  @CommandNotFound()
  private notFound(
    message: CommandMessage,
    client: Client
  ) {
    // ...
  }
}
```

### The prefix and commandCaseSensitive params
You can specify the `prefix` and the `commandCaseSensitive` on the `@Discord` and `@Command` params (you can specify only the prefix for `@CommandNotFound`). The params on the `@Command` will override those of `@Discord`.  

**But if you use different prefixes or case sensitivity, I recommend to implement multiple classes decorated by the `@Discord` parameter using different prefixes/case sensitivity. like for the [multipleDiscordInstances example](https://github.com/OwenCalvin/discord.ts/tree/master/examples/multipleDiscordInstances)**  

But here is an example for the different params:
```typescript
import {
  Discord,
  On,
  Client,
  Command,
  CommandMessage
} from "@typeit/discord";

@Discord({ prefix: "!", commandCaseSensitive: true })
abstract class AppDiscord {
  // Executed using the !HELLO command
  @Command("HELLO")
  private hello(message: CommandMessage) {
    // ...
  }

  // Executed if a command with the prefix "!" isn't found
  @CommandNotFound()
  private notFound(message: CommandMessage) {
    // ...
  }

  // Executed using the .helloDot command
  @Command("helloDot", { prefix: "." }) 
  private helloDot(message: CommandMessage) {
    // ...
  }

  // Executed if a command with the prefix "." isn't found
  @CommandNotFound({ prefix: "." })
  private notFoundDor(message: CommandMessage) {
    // ...
  }

  // Executed using 0ab, 0Ab, 0aB or 0AB
  @Command("ab", { prefix: "0" }) 
  private ab(message: CommandMessage) {
    // ...
  }
}
```

## Set the params (prefix and case sensitivity) programmaticaly
If you are forced to change the prefix during the execution or if it's loaded from a file when your app start, you can use two methods (it returns `true` if the params changed):
- `Client.setDiscordParams(discordInstance: InstanceType<any>, params: IDiscordParams): boolean`  
- `Client.setCommandParams(discordInstance InstanceType<any>, method: Function, params: IDiscordParams): boolean`  
> I recommend to not specify the prefix inside the decorator if you use one of these two methods, because it wouldn't be consistent)

```typescript
import {
  Discord,
  On,
  Client,
  Command,
  CommandMessage
} from "@typeit/discord";

@Discord({ prefix: "!" })
abstract class AppDiscord {
  @Command("prefix")
  private prefix(message: CommandMessage) {
    // Will change the prefix of all the @Command methods of this @Discord instance
    Client.setDiscordParams(this, {
      prefix: message.params[0]
    });
  }

  @Command("changeMyPrefix")
  private changeMyPrefix( message: CommandMessage) {
    // Will change the prefix of the changeMyPrefix method
    Client.setCommandParams(this, this.changeMyPrefix, {
      prefix: message.params[0]
    });
  }
}
```

## Guards
(Guards works also with `@Command` and `@CommandNotFound`)
You can use functions that are executed before your event to determine if it's executed. For example if you want to apply a prefix to the messages you can simply use the `@Guard` decorator:
(The `Prefix` function is provided by the `@typeit/discord` package, you can import it)
```typescript
import {
  Discord,
  On,
  Client,
  Guard,
  Prefix
} from "@typeit/discord";
import {
  Message
} from "discord.js";
import {
  NotBot
} from "./NotBot";

@Discord()
abstract class AppDiscord {
  @On("message")
  @Guard(
    NotBot, // You can use multiple guard functions, they are excuted in the same order!
    Prefix("!")
  )
  async onMessage(message: Message) {
    switch (message.content.toLowerCase()) {
      case "hello":
        message.reply("Hello!");
        break;
      default:
        message.reply("Command not found");
        break;
    }
  }
}
```

### The guard functions
Here is a simple example of a guard function (payload and client are injected like for events)
- If the function returns `false`: the next guards and the event function aren't executed  
- If the function returns `true`: it continues the executions of the next guards  
```typescript
import { Client } from "typeit/discord";
import { Message } from "discord.js";

export function NotBot(message: Message, client: Client) {
  return client.user.id !== message.author.id;
}
```

If you have to indicate parameters for a guard function (like for the `Prefix` guard) you can simple use the "function that returns a function" pattern like this:
```typescript
import { Client } from "typeit/discord";
import { Message } from "discord.js";

export function Prefix(text: string, replace: boolean = true) {
  return (message: Message, client: Client) => {
    const startWith = message.content.startsWith(text);
    if (replace) {
      message.content = message.content.replace(text, "");
    }
    return startWith;
  };
}
```

## Events and payload
Here you have the details about the payloads that are injected into the method related to a specific event.
Be aware that the types must be imported from discord.js (except for `Client`).
In this example of the event `"channelUpdate"` we receive two payloads from the event :
```typescript
@Discord()
abstract class AppDiscord {
  @On("channelUpdate")
  private onChannelUpdate(
    oldChannel: Channel,  // first one
    newChannel: Channel   // second one
  ) {
    // ...
  }
}
```

(Works for `@Once(event: string)` too)
```typescript
on(event: 'channelCreate', listener: (channel: Channel) => void);
on(event: 'channelDelete', listener: (channel: Channel) => void);
on(event: 'channelPinsUpdate', listener: (channel: Channel, time: Date) => void);
on(event: 'channelUpdate', listener: (oldChannel: Channel, newChannel: Channel) => void);
on(event: 'clientUserGuildSettingsUpdate', listener: (clientUserGuildSettings: ClientUserGuildSettings) => void);
on(event: 'clientUserSettingsUpdate', listener: (clientUserSettings: ClientUserSettings) => void);
on(event: 'debug', listener: (info: string) => void);
on(event: 'disconnect', listener: (event: any) => void);
on(event: 'emojiCreate', listener: (emoji: Emoji) => void);
on(event: 'emojiDelete', listener: (emoji: Emoji) => void);
on(event: 'emojiUpdate', listener: (oldEmoji: Emoji, newEmoji: Emoji) => void);
on(event: 'error', listener: (error: Error) => void);
on(event: 'guildBanAdd', listener: (guild: Guild, user: User) => void);
on(event: 'guildBanRemove', listener: (guild: Guild, user: User) => void);
on(event: 'guildCreate', listener: (guild: Guild) => void);
on(event: 'guildDelete', listener: (guild: Guild) => void);
on(event: 'guildMemberAdd', listener: (member: GuildMember) => void);
on(event: 'guildMemberAvailable', listener: (member: GuildMember) => void);
on(event: 'guildMemberRemove', listener: (member: GuildMember) => void);
on(event: 'guildMembersChunk', listener: (members: GuildMember[], guild: Guild) => void);
on(event: 'guildMemberSpeaking', listener: (member: GuildMember, speaking: boolean) => void);
on(event: 'guildMemberUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void);
on(event: 'guildUnavailable', listener: (guild: Guild) => void);
on(event: 'guildUpdate', listener: (oldGuild: Guild, newGuild: Guild) => void);
on(event: 'guildIntegrationsUpdate', listener: (guild: Guild) => void);
on(event: 'message', listener: (message: Message) => void);
on(event: 'messageDelete', listener: (message: Message) => void);
on(event: 'messageDeleteBulk', listener: (messages: Collection<Snowflake, Message>) => void);
on(event: 'messageReactionAdd', listener: (messageReaction: MessageReaction, user: User) => void);
on(event: 'messageReactionRemove', listener: (messageReaction: MessageReaction, user: User) => void);
on(event: 'messageReactionRemoveAll', listener: (message: Message) => void);
on(event: 'messageUpdate', listener: (oldMessage: Message, newMessage: Message) => void);
on(event: 'presenceUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void);
on(event: 'rateLimit', listener: (rateLimit: RateLimitInfo) => void);
on(event: 'ready', listener: () => void);
on(event: 'reconnecting', listener: () => void);
on(event: 'resume', listener: (replayed: number) => void);
on(event: 'roleCreate', listener: (role: Role) => void);
on(event: 'roleDelete', listener: (role: Role) => void);
on(event: 'roleUpdate', listener: (oldRole: Role, newRole: Role) => void);
on(event: 'typingStart', listener: (channel: Channel, user: User) => void);
on(event: 'typingStop', listener: (channel: Channel, user: User) => void);
on(event: 'userNoteUpdate', listener: (user: UserResolvable, oldNote: string, newNote: string) => void);
on(event: 'userUpdate', listener: (oldUser: User, newUser: User) => void);
on(event: 'voiceStateUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void);
on(event: 'warn', listener: (info: string) => void);
on(event: 'webhookUpdate', listener: (channel: TextChannel) => void);
on(event: string, listener: Function);
```

## Examples
An example is provided in the [`/examples` folder](https://github.com/OwenCalvin/DiscordTS/tree/master/examples) !

## Migration v1 to v2
You should just add parenthesis after the `@Discord` decorator, everywhere in your app.  
`@Discord class X` should now be `@Discord() class X`.

## See also
- [discord.js](https://discord.js.org/#/)
