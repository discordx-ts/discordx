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
This module is an extension of **[`discord.js`](https://discordjs.guide/)**, so the internal behavior (methods, properties, ...) is the same.

## Index
**Setup**

- [Need help?](https://github.com/OwenCalvin/discord.ts#%EF%B8%8F-need-help-)
- [Installation](https://github.com/OwenCalvin/discord.ts#-installation)
- [Setup](https://github.com/OwenCalvin/discord.ts#setup-and-start-your-application)

**Decorators**

- [`@Discord`](https://github.com/OwenCalvin/discord.ts#discord---getting-started)  
  Declare your Discord bot

- [`@On` / `@Once`](https://github.com/OwenCalvin/discord.ts#on--once---listen-to-the-events)  
  Create an event listener

- [`@Command`](https://github.com/OwenCalvin/discord.ts#-commands)  
  Create a command

- [`@Infos` / `@Description` / `@Name`](https://github.com/OwenCalvin/discord.ts#ℹ%EF%B8%8F-infos--description--name)  
  Add informations about your commands

- [`@Guard`](https://github.com/OwenCalvin/discord.ts#%EF%B8%8F-guards)  
  Add Guards to your events and commands

**API**

- [Retrieve the `@Commands` / `@On` / `@Discord` infos](https://github.com/OwenCalvin/discord.ts#api---retrieve-the-infos)
- [All events index](https://github.com/OwenCalvin/discord.ts#-events-and-payload)

**Informations**

## ☎️ Need help?
**[Simply join the Discord server](https://discord.gg/VDjwu8E)**
You can also find help with the [different projects that use discord.ts](https://github.com/OwenCalvin/discord.ts/network/dependents?package_id=UGFja2FnZS00Njc1MzYwNzU%3D) and in the [examples folder](https://github.com/OwenCalvin/discord.ts/tree/master/examples)

## 💾 Installation
Use [`npm`](https://www.npmjs.com/package/@typeit/discord) or `yarn` to install `@typeit/discord` with `discord.js`:

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
    "importHelpers": true,
    "forceConsistentCasingInFileNames": true,
    "lib": ["es2017", "esnext.asynciterable"],
    "moduleResolution": "node"
  },
  "exclude": ["node_modules"]
}
```

## Setup and start your application
In order to start your application, you must use the `discord.`**`ts`**'s `Client` (not the client that is provided by `discord.`**`js`**!).  
It works the same as the `discord.`**`js`**'s `Client` (same methods, properties, ...).

You have different parameters in addition to discord.js when you initialize your `Client`:

- **`classes` (required)**:  
  Indicate the class jacket of your classes containing the `@Discord` decorator. It accepts a list of classes or of (glob) paths.

- **`silent` (`false` by default)**:  
  Allows you to disable your event information at startup.

- **`guards` (`[]` by default)**:  
  Set the global guards.

**You must specify the glob path(s) where your decorated classes are**

```typescript
// Use the Client that are provided by @typeit/discord NOT discord.js
import { Client } from "@typeit/discord";

async function start() {
  const client = new Client({
    classes: [
      `${__dirname}/*Discord.ts`, // glob string to load the classes
      `${__dirname}/*Discord.js`, // If you compile using "tsc" the file extension change to .js
    ],
    silent: false
  });

  await client.login("YOUR_TOKEN");
}

start();
```

## @Discord - Getting started
So we start with an empty class (abstract is not necessary but this is more type-safe, the class shouldn't be initialized).

```typescript
abstract class AppDiscord {}
```

Then you must declare it as a Discord app class with the `@Discord` decorator :

```typescript
import { Discord } from "@typeit/discord";

@Discord() // Decorate the class
abstract class AppDiscord {}
```

### @On / @Once - Listen to the events
We can now declare methods that will be executed whenever a Discord event is triggered.  
Our methods must be decorated with the `@On(event: string)` or `@Once(event: string)` decorator.  
That's simple, when the event is triggered, the method is called:

```typescript
import { Discord, On, Once } from "@typeit/discord";

@Discord()
abstract class AppDiscord {
  @On("message")
  private onMessage() {
    // ...
  }

  @Once("messageDelete")
  private onMessageDelete() {
    // ...
  }
}
```

### Client payload injection
For each event a list of arguments is injected in your decorated method, you can type this list thanks to the `ArgsOf<Event>` type provided by `discord.ts`.
You also receive other useful arguments after that:

1. The event payload (`ArgsOf<Event>`)
2. The `Client` instance
3. The [guards](https://github.com/OwenCalvin/discord.ts#%EF%B8%8F-guards) payload

> You should use JS desctructuring for `ArgsOf<Event>` like in this example

```typescript
import { Discord, On, Client, ArgsOf } from "@typeit/discord";

@Discord()
abstract class AppDiscord {
  @On("message")
  private onMessage(
    [message]: ArgsOf<"message">, // Type message automatically
    client: Client, // Client instance injected here,
    guardPayload: any
  ) {
    // ...
  }
}
```

## 📟 Commands
`discord.ts` provides a decorator allowing the implementation of command systems very simply by essentially using only two decorators `@Command(rule?: string | RegExp | RuleBuilder)` and `@CommandNotFound()`.

We will also use `@Discord(prefix: string)` to specify a prefix for our commands within the class.

**You can specify a `regex` expression for your command names**  

> Notice that the first arguments do not use `ArgsOf`, the first payload is a `CommandMessage`.

```typescript
import {
  Discord,
  On,
  Client,
  Command,
  CommandMessage,
  CommandNotFound,
} from "@typeit/discord";

// Specify your prefix
@Discord("!")
abstract class AppDiscord {
  // Reachable with the command: !hello
  // in regex we test message.content.test(/^!hello(\s+|$)/i)
  @Command("hello")
  private hello(message: CommandMessage) {}

  // !bye
  // !yo
  @CommandNotFound()
  private notFound(message: CommandMessage) {}
}
```

### Regex with @Command
```typescript
import {
  Discord,
  On,
  Client,
  Command,
  CommandMessage,
  CommandNotFound,
} from "@typeit/discord";

// Specify your prefix
@Discord("!")
abstract class AppDiscord {
  // Reachable with the command: !hello
  // in regex we test message.content.test(/^!hello(\s+|$)/i)
  @Command(/hello/i)
  private hello(message: CommandMessage) {}

  // !bye
  // !yo
  @CommandNotFound()
  private notFound(message: CommandMessage) {}
}
``` 

### Async function with @Command
May be for a very specific case

```typescript
import {
  Discord,
  On,
  Client,
  Command,
  CommandMessage,
  CommandNotFound,
} from "@typeit/discord";

async function getCommand(command: CommandMessage, client: Client) {
  // Waits ...
  return /hello/i
}

// Specify your prefix
@Discord("!")
abstract class AppDiscord {
  // Reachable with the command: !hello
  // in regex we test message.content.test(/^!hello(\s+|$)/i)
  @Command(getCommand)
  private hello(message: CommandMessage) {}

  // !bye
  // !yo
  @CommandNotFound()
  private notFound(message: CommandMessage) {}
}
``` 

### RuleBuilder with @Command
It's not very clear sometimes to use a regex expression. For this reason you can use the `RuleBuilder` API:
To write `/salut\s+toi/i` it's simple and clear:

```typescript
import {
  ClassCommand,
  Command,
  CommandMessage,
  Rules,
  Rule, // "Rule()" is a shortcut for "new RuleBuilder()"
} from "@typeit/discord";

@Discord("!")
export abstract class Bye {
  @Rules(Rule("salut").space("toi"))
  async hello(command: CommandMessage) {
    command.reply("Ciao!");
  }
}
``` 

### The `CommandMessage` object
The `CommandMessage` is the first argument injected into a method using `@Command` or `@CommandNotFound`, it has exactly the same structure as the `Message` object in `discord.js` except that it includes useful information about the command that was executed such as:

- `prefix`: `RuleBuilder`  
  The prefix that is applied to your command

- `content`: `string`  
  The content of your message

- `id`: `string`  
  The id of your message

- `client`: `Client`  
  The client reference

- `message`: `string`  
  The reference to the discord.js message instance (you use it to access to some methods like `commandMessage.message.reply("okay")`)

- `name`: `string`  
  The command name

- `description`: `string`  
  [The command description](https://github.com/OwenCalvin/discord.ts#infos--description)

- `infos`: `InfoType` (`any`)  
  [The command infos](https://github.com/OwenCalvin/discord.ts#infos--description)

- `params`: `ParamsType` (`any`)  
  [The parsed command params](https://github.com/OwenCalvin/discord.ts#args-parsing)

- `discord`: `DiscordInfos`:  
  The linked `@Discord` class infos

- `rules`: `RuleBuilder[]`:  
  The rules of the command (it's a regex description)

- `values`: `string[]`:  
  Your message content splitted by space  
  `hello my name is stan` becomes `["hello", "my", "name", "is", "stan"]`

- `paramsString`: `string`:   
  Your message content without the command part  
  `-command hello my name is stan` becomes `"my name is stan"`

- `paramsValues`: `string`:   
  `paramsString` splitted by space  
  `"my name is stan"` becomes `["my", "name", "is", "stan"]`

### Params parsing
You have the ability to specify arguments for your command, as `express.js` does in it's routing system. So by using `":"` (or the value specified in `variablesChar` when your `Client` intializes) in the name of your `@Command` in front of the dynamic values, `discord.ts` will extract these informations when a command is executed and inject it into the `args` property of your `CommandMessage` with the correct name that you indicated in the command name.

> If the argument value is a number the value will be casted automaticaly

```typescript
@Discord("!")
abstract class AppDiscord {
  @Command("args", "SLUG", "NUMBER")
  private hello(message: CommandMessage) {
    const mySlug = message.params.SLUG;
    const myNumber = message.params.NUMBER;

    // Using js destructuring:
    const { SLUG, NUMBER } = message.params;
  }
}
```

### Dynamic Values
Okay but what if my prefix or my command name of my `@Discord` / `@Command` decorators depends on external datas? Well you can specify a function that will be executed when a command is executed to verify the origin and return the correct value.

You receive the `Message` as the first argument and the `Client` instance as the second one.

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

With a dynamic command name:

> May be for a very specific use case

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

// The command name will be yo if the message is "hello"
async function commandName(message: Message, client: Client) {
  if (message.content === "hello") {
    return "yo";
  }
  return "hello";
}

@Discord(prefixBehaviour)
abstract class AppDiscord {
  @Command(commandName)
  private hello(message: CommandMessage) {
    // ...
  }
}
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
- MessageDelete.ts
```

You should use the `import` parameter for the `@Discord` decorator.
Here, all the elements will be injected into this Discord class instance.

```typescript
import * as Path from "path";
import { Discord, CommandNotFound } from "@typeit/discord";

// The prefix will be applied to the imported commands
@Discord("!", {
  import: [
    Path.join(__dirname, "commands", "*.ts"),
    Path.join(__dirname, "events", "*.ts"),
    // You can also specify the class directly here if you don't want to use a glob
  ],
})
export abstract class DiscordApp {
  // This command not found is triggered
  @CommandNotFound()
  notFoundA(command: CommandMessage) {
    command.reply("Command not found");
  }
}
```

Here is an example of what your command file should look like:
_Bye.ts_

```typescript
import { Command, CommandMessage } from "@typeit/discord";

// Do not have to decorate the class with @Discord
// It applied the parameters of the @Discord decorator that imported it
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

_MessageDelete.ts_

```typescript
import { On, ArgsOf } from "@typeit/discord";

// Do not have to decorate the class with @Discord
// It applied the parameters of the @Discord decorator that imported it
export abstract class MessageDelete {
  @On("messageDelete")
  async onMessageDelete([message]: ArgsOf<"messageDelete">) {
    message.reply("Bye!");
  }
}
```

## ℹ️ @Infos / @Description / @Name
It would be useful to be able to specify order information, for example to display a help command (`!help`) in your application.
For the one you have two useful decorators which are `@Infos`, `@Name` and `@Description`.

> `@Description` is a shortcut for `@Infos({ description: "..." })`  
> `@Name` is a shortcut for `@Infos({ name: "..." })`

```typescript
import { ClassCommand, Command, CommandMessage } from "@typeit/discord";

@Discord("!")
@Description("Admin commands")
@Infos({ forAdmins: true })
export abstract class Bye {
  @Command("ciao")
  @Description("say ciao")
  @Name("Ciao")
  async ciao(command: CommandMessage) {
    command.reply("Ciao!");
  }
}
```

To retrieve these informations, you can use the `Client` static methods:

```typescript
import { Client } from "@typeit/discord";

Client.getCommands(); // @Command
Client.getCommandsNotFound(); // @CommandNotFound
Client.getEvents(); // @On
Client.getDiscords(); // @Discord
```

## ⚔️ Guards
You can use functions that are executed before your event to determine if it's executed. For example, if you want to apply a prefix to the messages, you can simply use the `@Guard` decorator.

The order of execution of the guards is done according to their position in the list, so they will be executed in order (from top to bottom).

Guards can be set for `@Command`, `@CommandNotFound`, `@Discord` and globally.

```typescript
import { Discord, On, Client, Guard } from "@typeit/discord";
import { NotBot } from "./NotBot";
import { Prefix } from "./Prefix";

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

### Guards for `@Discord`
When you use `@Guard` along with `@Discord` the guard is applied to:
- each `@On` of the class
- each `@Once` of the class
- each `@Command` of the class
- each `@CommandNotFound` of the class

> It's executed before the members's guards

```typescript
import { Discord, On, Client, Guard, CommandMessage } from "@typeit/discord";
import { NotBot } from "./NotBot";
import { Prefix } from "./Prefix";

@Discord()
@Guard(NotBot, Prefix("!"))
abstract class AppDiscord {
  @On("message")
  message([message]: ArgsOf<"message">) {
    //...
  }
  
  @Command("hello")
  message(command: CommandMessage) {
    //...
  }
}
```

### Global guards
When can setup some guards globally using `Client.setGuards`

> The global guards are set statically, you can access it by `Client.guards`

```typescript
// Use the Client that are provided by @typeit/discord NOT discord.js
import { Client } from "@typeit/discord";

async function start() {
  const client = new Client({
    classes: [
      `${__dirname}/*Discord.ts`, // glob string to load the classes
      `${__dirname}/*Discord.js`, // If you compile using "tsc" the file extension change to .js
    ],
    silent: false,
    // At instanciation
    guards: [NotBot, Prefix("!")]
  });

  // Or using client.setGuards
  Client.setGuards(NotBot, Prefix("!"));

  await client.login("YOUR_TOKEN");
}

start();
```

### The guard functions
Here is a simple example of a guard function (the payload and the client instance are injected like for events)  
Guards work like `Koa`'s, it's a function passed in parameter (after the `Client`'s instance) and you will have to call if the guard is passed.

> If next isn't called the next guard (or the main method) will not be executed

```typescript
import { GuardFunction } from "@typeit/discord";

export const NotBot: GuardFunction<"message"> = ([message], client, next) => {
  if (client.user.id !== message.author.id) {
    await next();
  }
};
```

If you have to indicate parameters for a guard function you can simple use the "function that returns a function" pattern like this:

```typescript
import { GuardFunction } from "@typeit/discord";

export function Prefix(text: string, replace: boolean = true) {
  const guard: GuardFunction<"message"> = ([message], client, next) => {
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

### Guard datas
As 4th parameter you receive a basic empty object that can be used to transmit data between guard and with your main method.

```typescript
import { GuardFunction } from "@typeit/discord";

export const NotBot: GuardFunction<"message"> = (
  [message],
  client,
  next,
  guardDatas
) => {
  if (client.user.id !== message.author.id) {
    guardDatas.message = "the NotBot guard passed";
    await next();
  }
};
```

```typescript
import { Discord, Command, Client, Guard } from "@typeit/discord";
import { NotBot } from "./NotBot";
import { Prefix } from "./Prefix";

@Discord()
abstract class AppDiscord {
  @Command()
  @Guard(NotBot, Prefix("!"))
  async hello(command: CommandMessage, client: Client, guardDatas: any) {
    console.log(guardDatas.message);
    // > the NotBot guard passed
  }
}
```

## API - Retrieve the infos
You can simply get all the infos about your decorated stuff using:

```typescript
import { Client } from "@typeit/discord";

Client.getCommands(); // @Command
Client.getCommandsNotFound(); // @CommandNotFound
Client.getEvents(); // @On
Client.getDiscords(); // @Discord
```

## 💡 Events and payload
Here you have the details about the payloads that are injected into the method related to a specific event.
Note that on some events, for example voiceStateUpdate, it will return an array of the subsequent event payloads, and the second parameter will be the discord.ts Client.
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

## Migration v4 to v5
`@Rules` and `@ComputedRules` do not exists anymore, we simplify everything and corrected some bugs.

## See also

- [discord.js](https://discord.js.org/#/)
