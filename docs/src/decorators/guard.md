# Guards

You can use functions that are executed before your event to determine if it's executed. For example, if you want to apply a prefix to the messages, you can simply use the `@Guard` decorator.

The order of execution of the guards is done according to their position in the list, so they will be executed in order (from top to bottom).

Guards can be set for `@Slash`, `@On`, `@Once`, `@Discord` and globaly.

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

## Guards for @Discord

When you use `@Guard` along with `@Discord` the guard is applied to:

- Each `@Slash` of the class
- Each `@On` of the class
- Each `@Once` of the class

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

## Global guards

When can setup some guards globaly by assigning `Client.guards`

> The global guards are set statically, you can access it by `Client.guards`    
>
> Global guards are executed before @Discord guards

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
    guards: [NotBot, Prefix("!")],
  });

  // Or using client.guards
  Client.guards = [NotBot, Prefix("!")];

  await client.login("YOUR_TOKEN");
}

start();
```

## The guard functions

Here is a simple example of a guard function (the payload and the client instance are injected like for events)  

Guards work like `Koa`'s, it's a function passed in parameter (third parameter in the guard function) and you will have to call if the guard is passed.

**If `next` isn't called the next guard (or the main method) will not be executed**

```typescript
import { GuardFunction, ArgsOf } from "@typeit/discord";

export const NotBot: GuardFunction<ArgsOf<"message">> = ([message], client, next) => {
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
