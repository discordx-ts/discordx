<p align="center">
  <br/>
  <img src="https://i.imgur.com/afS1H2x.png" width="150px">
  <br/>
  <br/>
  <h1 align="center">
    <p  align="center">
      discord.ts (@typeit/discord)
    </p>
  </h1>
  <p align="center">
    Create your discord bot by using TypeScript and decorators!  
  </p>
  <br/>
</p>

## Introduction
This module is built on `discord.js`, so the internal behavior (methods, properties, ...) is the same.

## Index
**Setup**
- Need help ?
- Installation
- Setup

**Decorators**
* `@Discord`
* `@On` / `@Once`
* `@Command`
* `@Infos` / `@Description`
* `@Rules` / `@ComputedRules`
* `@Guard`

**API**
- Retrieve the `@Commands` / `@On` / `@Discord` infos


## ☎️ Need help ?
**[Simply join the Discord server](https://discord.gg/VDjwu8E)**
You can also find help with the [different projects that use discord.ts](https://github.com/OwenCalvin/discord.ts/network/dependents?package_id=UGFja2FnZS00Njc1MzYwNzU%3D) and in the [examples folder](https://github.com/OwenCalvin/discord.ts/tree/master/examples)

## 💾 Installation
Use [`npm`](https://www.npmjs.com/package/@typeit/discord) or `yarn` to install `typeit/discord` with `discord.js`:
```sh
npm i @typeit/discord discord.js
```

Your tsconfig.json should look like this:
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

## Setup and start your application
In order to start your application, you must use the `discord.`**`ts`**'s `Client` (not the client that is provided by `discord.`**`js`**!).  
It works the same as the `discord.`**`js`**'s Client (same methods, properties, ...) but the `login` method is overriden and you can set the `silent` property (into `Client` initialization) in order to not log anything in the console.
**You must specify the glob path(s) where your decorated classes are**

```typescript
// Use the Client that are provided by @typeit/discord NOT discord.js
import { Client } from "@typeit/discord";

function start() {
  const client = new Client();
  client.login(
    "YOUR_TOKEN",
    `${__dirname}/*Discord.ts`, // glob string to load the classes
    `${__dirname}/*Discord.js` // If you compile using "tsc" the file extension change to .js
  );
}

start();
```

### Client payload injection
```typescript
import {
  Discord,
  On,
  Client,
  ArgsOf
} from "@typeit/discord";

@Discord()
abstract class AppDiscord {
  @On("message")
  private onMessage(
    [message]: ArgsOf<"message">, // Type message automatically
    client: Client // Client instance injected here
  ) {
    // ...
  }
}
```

## @Discord - Getting started
So we start with an empty class (abstract is not necessary but this is more type-safe, the class shouldn't be initialized).
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

### @On / @Once - Listen to the events
We can now declare methods that will be executed whenever a Discord event is triggered.  
Our methods must be decorated with the `@On(event: string)` or `@Once(event: string)` decorator.  
When the event is triggered, the method is called and we receive the values (in arguments) related to the event.
Here, we receive the message instance (details below) :

```typescript
import { Discord, On, ArgsOf } from "@typeit/discord";

@Discord()
abstract class AppDiscord {
  @On("message")
  private onMessage([message]: ArgsOf<"message">) {
    // ...
  }
}
```

## 📟 Commands
You can simply use the `@Command` and `@CommandNotFound` decorators to implement a command system in your app.  

**Typing:**  
When you use the `@Command` or the `@CommandNotFound` decorator, you have to type your first parameters as a `CommandMessage`. It gives you more informations about the message that is used as a command.

**Parameters:**  
`@Discord`: You can specify the prefix for all commands in the `@Discord` decorator.  
`@Command`: You can specify the command name for the method (by default the method name is taken)

> `@CommandNotFound` is executed if the message match any command **in the class**

```typescript
import {
  Discord,
  On,
  Client,
  Command,
  CommandMessage
} from "@typeit/discord";

@Discord("!") // Specify your prefix
abstract class AppDiscord {
  @Command("hello") // Reachable with the command: !hello
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

### Dynamic paramaters
If your prefixes or your command names depends on dynamic datas you can pass (async) functions into the decorators.
> It also works for `@Command`
```typescript
// If the message has been sent in the guild with
// the name MyGuildName the prefix "." will be considered
// otherwise the prefix "$" will trigger the action.
async function prefixBehaviour(message: Message, client: Client) {
  if (message.guild.name === "MyGuildName") {
    return ".";
  }
  return "$";
}

@Discord(prefixBehaviour)
abstract class AppDiscord {
  @Command("hello")
  private hello(message: CommandMessage) {
    // ...
  }
}
```

### API - Retrive the infos
You can simply get all the infos about your decorated stuff using:

```typescript
import { Client } from "@typeit/discord";

Client.getCommands();         // @Command
Client.getCommandsNotFound(); // @CommandNotFound
Client.getEvents();           // @On
Client.getDiscords();         // @Discord
```

### Command directory pattern
> [Example](https://github.com/OwenCalvin/discord.ts/tree/master/examples/commands-dir)  

If you have a directory pattern that looks like this:
```sh
Main.ts
DiscordApp.ts
commands
- Ping.ts
- Hello.ts
- Blabla.ts
events
- messageDelete
```

You should use the `import` parameter for the `@Discord` decorator.
Here, all the elements will be injected into this Discord class instance.
```typescript
import {
  Discord,
  CommandNotFound
} from "@typeit/discord";

// The prefix will be applied to the imported commands
@Discord("!", {
  import: [
    Path.join(__dirname,  "commands", "*.ts")
    // You can also specify the class directly here if you don't want to use a glob
  ]
})
export abstract class DiscordApp {
  // This command not found is triggered
  @CommandNotFound()
  notFoundA(commad: CommandMessage) {
    commad.reply("Command not found");
  }
}
```

Here is an example of what your command file should look like:
```typescript
import {
  ClassCommand,
  Command,
  CommandMessage
} from "@typeit/discord";

// Do not have to decorate the class with @Discord
export abstract class Bye {
  @Command("bye")
  async bye(command: CommandMessage) {
    command.reply("Bye!");
  }

  @Command("ciao")
  async ciao(command: CommandMessage) {
    command.reply("Ciao!");
  }
}
```

## ⚔️ Guards
> Guards works also with `@Command` and `@CommandNotFound`   

You can use functions that are executed before your event to determine if it's executed. For example, if you want to apply a prefix to the messages, you can simply use the `@Guard` decorator:  

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
  async onMessage([message]: ArgsOf<"message">) {
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
> Notice that the guard function is impacted by your payloadInjection policy  

Here is a simple example of a guard function (the payload and the client instance are injected like for events)
The guard works as the same ways as `koa` do, a `next` function is injected as the third parameter (after the `Client`) and you must call it to pass the guard.
```typescript
import { Client, ArgsOf } from "typeit/discord";

export const NotBot: GuardFunction<"message"> = (
  [message],
  client
) => {
  if (client.user.id !== message.author.id) {
    await next();
  }
}
```

If you have to indicate parameters for a guard function you can simple use the "function that returns a function" pattern like this:
```typescript
import { Client, ArgsOf } from "typeit/discord";

export function Prefix(text: string, replace: boolean = true) {
  const guard: GuardFunction<"message"> = (
    [message],
    client,
    next
  ) => {
    const startWith = message.content.startsWith(text);
    if (replace) {
      message.content = message.content.replace(text, "");
    }
    if (startWith) {
      await next();
    }
  };

  return guard;
}
```

## 💡 Events and payload
Here you have the details about the payloads that are injected into the method related to a specific event.
**`@Once(event: DiscordEvent)` exists too, it executes the method only one time**

### The argument list
Here is all the `DiscordEvents` and their parameters (`discord.js` version 12.2.0)
- **channelCreate**: `(Channel)`
- **channelDelete**: `(Channel | PartialDMChannel)`
- **channelPinsUpdate**: `(Channel | PartialDMChannel, Date)`
- **channelUpdate**: `(Channel, Channel)`
- **debug**: `(string)`
- **warn**: `(string)`
- **disconnect**: `(any, number)`
- **emojiCreate**: `(GuildEmoji)`
- **emojiDelete**: `(GuildEmoji)`
- **emojiUpdate**: `(GuildEmoji, GuildEmoji)`
- **error**: `(Error)`
- **guildBanAdd**: `(Guild, User | PartialUser)`
- **guildBanRemove**: `(Guild, User | PartialUser)`
- **guildCreate**: `(Guild)`
- **guildDelete**: `(Guild)`
- **guildUnavailable**: `(Guild)`
- **guildIntegrationsUpdate**: `(Guild)`
- **guildMemberAdd**: `(GuildMember | PartialGuildMember)`
- **guildMemberAvailable**: `(GuildMember | PartialGuildMember)`
- **guildMemberRemove**: `(GuildMember | PartialGuildMember)`
- **guildMembersChunk**: `(Collection<Snowflake, GuildMember | PartialGuildMember>, Guild)`
- **guildMemberSpeaking**: `(GuildMember | PartialGuildMember, Readonly<Speaking>)`
- **guildMemberUpdate**: `(GuildMember | PartialGuildMember, GuildMember | PartialGuildMember)`
- **guildUpdate**: `(Guild, Guild)`
- **inviteCreate**: `(Invite)`
- **inviteDelete**: `(Invite)`
- **message**: `(Message)`
- **messageDelete**: `(Message | PartialMessage)`
- **messageReactionRemoveAll**: `(Message | PartialMessage)`
- **messageReactionRemoveEmoji**: `(MessageReaction)`
- **messageDeleteBulk**: `(Collection<Snowflake, Message | PartialMessage>)`
- **messageReactionAdd**: `(MessageReaction, User | PartialUser)`
- **messageReactionRemove**: `(MessageReaction, User | PartialUser)`
- **messageUpdate**: `(Message | PartialMessage, Message | PartialMessage)`
- **presenceUpdate**: `(Presence | undefined, Presence)`
- **rateLimit**: `(RateLimitData)`
- **ready**: `()`
- **invalidated**: `()`
- **roleCreate**: `(Role)`
- **roleDelete**: `(Role)`
- **roleUpdate**: `(Role, Role)`
- **typingStart**: `(Channel | PartialDMChannel, User | PartialUser)`
- **userUpdate**: `(User | PartialUser, User | PartialUser)`
- **voiceStateUpdate**: `(VoiceState, VoiceState)`
- **webhookUpdate**: `(TextChannel)`
- **shardDisconnect**: `(CloseEvent, number)`
- **shardError**: `(Error, number)`
- **shardReady**: `(number)`
- **shardReconnecting**: `(number)`
- **shardResume**: `(number, number)`

## Examples
Some examples are provided in the [`/examples` folder](https://github.com/OwenCalvin/discord.ts/tree/master/examples) !

## Migration v1 to v2
You should just add parenthesis after the `@Discord` decorator, everywhere in your app.  
`@Discord class X` should now be `@Discord() class X`.

## Migration v2 to v3
Now the `payloadInjection` policy is by default `"first"`, convert each events of your app or change your `payloadInjection` policy to `"spread"` inside the `Client` constructor:  
```typescript
const client = new Client({
  payloadInjection: "spread"
})
```

## See also
- [discord.js](https://discord.js.org/#/)
