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

## ☎️ Need help ?
**[Simply join the Discord server](https://discord.gg/VDjwu8E)**
You can also find help with the [different projects that use discord.ts](https://github.com/OwenCalvin/discord.ts/network/dependents?package_id=UGFja2FnZS00Njc1MzYwNzU%3D) and in the [examples folder](https://github.com/OwenCalvin/discord.ts/tree/master/examples)

## 💾 Installation
Use [`npm`](https://www.npmjs.com/package/@typeit/discord) or `yarn` to install `typeit/discord` with the peer dependecies (`discord.js`)
you must install `reflect-metadata` for the decorators and import it at your entry point:
```sh
npm i @typeit/discord discord.js reflect-metadata
```

```typescript
import "reflect-metadata";

// start ...
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

## 🚀 Getting started
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

We can now declare methods that will be executed whenever a Discord event is triggered.  
Our methods must be decorated with the `@On(event: string)` or `@Once(event: string)` decorator.  
When the event is triggered, the method is called and we receive the values (in arguments) related to the event.
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
It works the same as the discord.js's Client (same methods, properties, ...) but the `login` method is overriden and you can set the `silent` property (into `Client` initialization) in order to not log anything in the console.
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
You will also receive the client instance always as the last payload:
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

## 📟 Commands
You can simply use the `@Command` and `@CommandNotFound` decorators to implement a command system in your app.  

When you use the `@Command` or the `@CommandNotFound` decorator, you should type your first parameters as a `CommandMessage`. It provides the command parameters, the prefix, and the command (specified [here](https://github.com/OwenCalvin/discord.ts/blob/master/src/Types/CommandMessage.ts)).  

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

### The command parameters
You can specify the `prefix` and the `commandCaseSensitive` on the `@Discord` and `@Command` params (you can specify only the prefix of `@CommandNotFound`). The params on the `@Command` will override those of `@Discord`.  
The `@Command` decorator also have a `description` parameter and an `infos` one. The description one is useful if you have an help command to display the command description. The `infos` one can store anything you want.

**If you use different prefixes or case sensitivity, I recommend implementing multiple classes decorated by the `@Discord` parameter using different prefixes/case sensitivity, like the [multipleDiscordInstances example](https://github.com/OwenCalvin/discord.ts/tree/master/examples/multipleDiscordInstances).**  

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
  private notFoundDot(message: CommandMessage) {
    // ...
  }

  // Executed using 0ab, 0Ab, 0aB or 0AB
  @Command("ab", { prefix: "0" }) 
  private ab(message: CommandMessage) {
    // ...
  }
}
```

### Dynamic prefix
If you have different prefix for different servers you can use dynamic prefixes using functions like this:
```typescript
// If the message has been sent in the guild with the name MyGuildName the prefix "." will be considered otherwise the prefix "$" will trigger the action.
async function prefixBehaviour(message: Message, client: Client) {
  if (message.guild.name === "MyGuildName") {
    return ".";
  }
  return "$";
}

@Discord({ prefix: prefixBehaviour })
abstract class AppDiscord {
  @Command("HELLO")
  private hello(message: CommandMessage) {
    // ...
  }
}
```


### Retrieve the commands
You can simply get all the commands and their details using `Client.getCommands<InfoType>(forPrefix?: string): ICommandInfos[]`.
> If you specify no prefix for the `forPrefix` parameter, you will receive the details of all the commands.

```typescript
import {
  Discord,
  On,
  Client,
  Command,
  CommandMessage
} from "@typeit/discord";

interface Infos {
  requiredRole: string;
}

@Discord({ prefix: "!" })
abstract class AppDiscord {
  @Command("hello", {
    description: "The command simply say hello",
    infos: { requiredRole: "master" }
  })
  private hello(
    message: CommandMessage,
    client: Client
  ) {
    // ...
  }

  @Command("help")
  private hello(
    message: CommandMessage,
    client: Client
  ) {
    // You receive all the commands prefixed by "!"
    const commands = Client.getCommands<Infos>("!");

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

### Command directory pattern
> [Example](https://github.com/OwenCalvin/discord.ts/tree/master/examples/commandsDir)
If you have a directory pattern that looks like this:
```shell
Main.ts
DiscordApp.ts
commands
- Ping.ts
- Hello.ts
- Blabla.ts
```
You should use the `importCommands` parameter for the `@Discord` decorator.
Here, all of the commands will be injected into this Discord class instance.
```typescript
import {
  Discord,
  CommandNotFound
} from "@typeit/discord";

@Discord({
  prefix: "!", // The Discord parameters will be applied to the imported commands
  importCommands: [
    Path.join(__dirname,  "commands", "*.ts")
    // You can also specify the class directly here if you don't want to use a glob
  ]
})
export abstract class DiscordApp {
  @CommandNotFound({ prefix: "!" })
  notFoundA(commad: CommandMessage) {
    commad.reply("Command not found");
  }
}
```

Here is an example of what your command file should look like:
```typescript
import { ClassCommand, Command, CommandMessage } from "@typeit/discord";

export abstract class Bye implements ClassCommand {
  @Command("bye")
  async execute(command: CommandMessage) {
    command.reply("Bye!");
  }
}
```

### Set commands paramaters programmaticaly
If you are forced to change the prefix during the execution or if it's loaded from a file when your app start, you can use two methods (it returns `true` if the params changed):
- `Client.setDiscordParams(discordInstance: InstanceType<any>, params: IDiscordParams): boolean`  
- `Client.setCommandParams(discordInstance InstanceType<any>, method: Function, params: ICommandParams): boolean`  
>I recommend not specifying the prefix inside the decorator if you use one of these two methods because it wouldn't be consistent

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
  private changeMyPrefix(message: CommandMessage) {
    // Will change the prefix of the changeMyPrefix method
    Client.setCommandParams(this, this.changeMyPrefix, {
      prefix: message.params[0]
    });
  }
}
```

The command class should look like that:
```typescript
import {
  ClassCommand,
  Command,
  CommandMessage
} from "@typeit/discord";

export abstract class Bye implements ClassCommand {
  @Command()
  async execute(command: CommandMessage) {
    command.reply("Bye!");
  }
}
```

## ⚔️ Guards
> Guards works also with `@Command` and `@CommandNotFound`   

You can use functions that are executed before your event to determine if it's executed. For example, if you want to apply a prefix to the messages, you can simply use the `@Guard` decorator:
(The `Prefix` function is provided by the `@typeit/discord` package, where you can import it)
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
Here is a simple example of a guard function (the payload and the client instance are injected like for events)
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

## 💡 Events and payload
Here you have the details about the payloads that are injected into the method related to a specific event.
Be aware that the types must be imported from discord.js (except for `Client`).
In this example of the event `"channelUpdate"`, we receive two payloads from the event :
> it works for `@Once(event: DiscordEvent)` too
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

Here is all the `DiscordEvents` and their parameters (`discord.js` version 12.2.0)
> Example for the first one:  
> `@On("`**channelCreate**`")`  
> `onChannelCreate(`**channel: Channel**`) { }`

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
- **guildMembersChunk**: `(Collection<Snowflake, GuildMember | - Pa**rtialGuildMember>, Guild)`
- **guildMemberSpeaking**: `(GuildMember | PartialGuildMember, - Re**adonly<Speaking>)`
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
An example is provided in the [`/examples` folder](https://github.com/OwenCalvin/DiscordTS/tree/master/examples) !

## Migration v1 to v2
You should just add parenthesis after the `@Discord` decorator, everywhere in your app.  
`@Discord class X` should now be `@Discord() class X`.

## See also
- [discord.js](https://discord.js.org/#/)
