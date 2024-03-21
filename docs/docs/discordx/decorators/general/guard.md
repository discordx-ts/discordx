# @Guard

You can use functions that are executed before your event to determine if it's executed. For example, if you want to apply a prefix to the messages, you can simply use the `@Guard` decorator.

The order of execution of the guards is done according to their position in the list, so they will be executed in order (from top to bottom).

## Supported with

- [@ButtonComponent](../gui/button-component)
- [@ContextMenu](../gui/context-menu)
- [@Discord](./discord)
- [@ModalComponent](../gui/modal-component)
- [@On](./on)
- [@Once](./once)
- [@SelectMenuComponent](../gui/select-menu-component)
- [@SimpleCommand](../command/simple-command)
- [@Slash](../command/slash)

## Example

```typescript
import { NotBot } from "@discordx/utilities";
import { Discord, On, Client, Guard } from "discordx";

@Discord()
class Example {
  @On("messageCreate")
  @Guard(
    NotBot, // You can use multiple guard functions, they are executed in the same order!
  )
  async onMessage([message]: ArgsOf<"messageCreate">) {
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

- `@ButtonComponent`
- `@ContextMenu`
- `@ModalComponent`
- `@On`
- `@Once`
- `@Reaction`
- `@SelectMenuComponent`
- `@SimpleCommand`
- `@Slash`

### Example

```typescript
import { NotBot } from "@discordx/utilities";
import { Events } from "discord.js";
import {
  ArgsOf,
  Discord,
  Guard,
  On,
  SimpleCommand,
  SimpleCommandMessage,
} from "discordx";

@Discord()
@Guard(NotBot)
class Example {
  @On({ event: Events.MessageCreate })
  message([message]: ArgsOf<"messageCreate">) {
    //...
  }

  @SimpleCommand({ name: "hello" })
  hello(command: SimpleCommandMessage) {
    //...
  }
}
```

## Global guards

When can setup some guards globally

> Global guards are executed before @Discord guards

```typescript
import { NotBot } from "@discordx/utilities";
import { Client } from "discordx"; // Use the client provided by discordx, not discord.js.

async function start() {
  const client = new Client({
    botId: "test",
    silent: false,
    guards: [NotBot],
  });

  await client.login("YOUR_TOKEN");
}

start();
```

## The guard functions

Here is a simple example of a guard function (the payload and the client instance are injected like for events)

Guards work like `Koa`'s, it's a function passed in parameter (third parameter in the guard function) and you will have to call if the guard is passed.

**If `next` isn't called the next guard (or the main method) will not be executed**

```typescript
import { GuardFunction, ArgsOf } from "discordx";

export const NotBot: GuardFunction<ArgsOf<"messageCreate">> = async (
  [message],
  client,
  next,
) => {
  if (client.user.id !== message.author.id) {
    await next();
  }
};
```

If you have to indicate parameters for a guard function you can simple use the "function that returns a function" pattern like this:

```typescript
export function Prefix(text: string, replace: boolean = true) {
  const guard: GuardFunction<
    ArgsOf<"messageCreate"> | CommandInteraction
  > = async (arg, client, next) => {
    const argObj = arg instanceof Array ? arg[0] : arg;
    if (argObj instanceof CommandInteraction) {
      await next();
    } else {
      const message = argObj;
      const startWith = message.content.startsWith(text);
      if (replace) {
        message.content = message.content.replace(text, "");
      }
      if (startWith) {
        await next();
      }
    }
  };

  return guard;
}
```

### Guard data

As 4th parameter you receive a basic empty object that can be used to transmit data between guard and with your main method.

```typescript
export const NotBot: GuardFunction<
  | ArgsOf<"messageCreate" | "messageReactionAdd" | "voiceStateUpdate">
  | ButtonInteraction
  | ChannelSelectMenuInteraction
  | CommandInteraction
  | ContextMenuCommandInteraction
  | MentionableSelectMenuInteraction
  | ModalSubmitInteraction
  | RoleSelectMenuInteraction
  | StringSelectMenuInteraction
  | UserSelectMenuInteraction
  | SimpleCommandMessage
> = async (arg, client, next, guardData) => {
  const argObj = arg instanceof Array ? arg[0] : arg;
  const user =
    argObj instanceof CommandInteraction
      ? argObj.user
      : argObj instanceof MessageReaction
        ? argObj.message.author
        : argObj instanceof VoiceState
          ? argObj.member?.user
          : argObj instanceof Message
            ? argObj.author
            : argObj instanceof SimpleCommandMessage
              ? argObj.message.author
              : argObj instanceof ButtonInteraction ||
                  argObj instanceof ChannelSelectMenuInteraction ||
                  argObj instanceof CommandInteraction ||
                  argObj instanceof ContextMenuCommandInteraction ||
                  argObj instanceof MentionableSelectMenuInteraction ||
                  argObj instanceof ModalSubmitInteraction ||
                  argObj instanceof RoleSelectMenuInteraction ||
                  argObj instanceof StringSelectMenuInteraction ||
                  argObj instanceof UserSelectMenuInteraction
                ? argObj.member?.user
                : argObj.message.author;

  if (!user?.bot) {
    guardData.message = "the NotBot guard passed";
    await next();
  }
};
```

```typescript
import { Discord, Slash, Client, Guard } from "discordx";
import { CommandInteraction } from "discord.js";
import { NotBot } from "./NotBot";

@Discord()
class Example {
  @Slash({ description: "hello" })
  @Guard(NotBot)
  async hello(
    interaction: CommandInteraction,
    client: Client,
    guardData: { message: string },
  ) {
    console.log(guardData.message);
    // > the NotBot guard passed
  }
}
```

### Access client from decorator

```ts
@Discord()
class Example {
  @SimpleCommand({ name: "my-cmd" })
  async myCmd(command: SimpleCommandMessage, client: Client) {
    command.message.reply("Hello :wave_tone1:");
  }
}
```

### Access guard data from decorator

```ts
@Discord()
class Example {
  @SimpleCommand({ name: "my-cmd" })
  async myCmd(command: SimpleCommandMessage, client: Client, guardData: any) {
    command.message.reply("Hello :wave_tone1:");
  }
}
```

## Signature

```ts
Guard<Type = any, DataType = any>(
  ...fns: GuardFunction<Type, DataType>[]
);
```

## Make changes to

It either extends or overwrites data configured in below decorators, however, the order of decorators matters.

[@ButtonComponent](../gui/button-component)

[@SelectMenuComponent](../gui/select-menu-component)

[@Discord](./discord)

[@ModalComponent](../gui/modal-component)

[@On](./on)

[@Once](./once)

[@SimpleCommand](../command/simple-command)

[@Slash](../command/slash)
