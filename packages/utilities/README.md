<div>
  <p align="center">
    <a href="https://discordx.js.org" target="_blank" rel="nofollow">
      <img src="https://discordx.js.org/discordx.svg" width="546" />
    </a>
  </p>
  <div align="center" class="badge-container">
    <a href="https://discordx.js.org/discord"
      ><img
        src="https://img.shields.io/discord/874802018361950248?color=5865F2&logo=discord&logoColor=white"
        alt="Discord server"
    /></a>
    <a href="https://www.npmjs.com/package/@discordx/utilities"
      ><img
        src="https://img.shields.io/npm/v/@discordx/utilities.svg?maxAge=3600"
        alt="NPM version"
    /></a>
    <a href="https://www.npmjs.com/package/@discordx/utilities"
      ><img
        src="https://img.shields.io/npm/dt/@discordx/utilities.svg?maxAge=3600"
        alt="NPM downloads"
    /></a>
    <a href="https://github.com/discordx-ts/discordx/actions"
      ><img
        src="https://github.com/discordx-ts/discordx/workflows/Build/badge.svg"
        alt="Build status"
    /></a>
    <a href="https://www.paypal.me/vijayxmeena"
      ><img
        src="https://img.shields.io/badge/donate-paypal-F96854.svg"
        alt="paypal"
    /></a>
  </div>
  <p align="center">
    <b> Create a discord bot with TypeScript and Decorators! </b>
  </p>
</div>

# Content

- [Introduction](#-introduction)
- [Installation](#-installation)
- [@Category](#-category)
- [@Description](#-description)
- [guards](#%EF%B8%8F-guards)
  - [IsGuildUser](#isguilduser)
  - [NotBot](#notbot)
  - [PermissionGuard](#permissionguard)
  - [Rate Limit](#rate-limit)
- [Useful](#-useful)
  - [EnumChoice](#enumchoice)
  - [TimeFormat](#timeformat)

# 📖 Introduction

Add useful features to discordx, If a feature isn't available, request it.

# 💻 Installation

Version 16.6.0 or newer of Node.js is required

```
npm install @discordx/utilities
yarn add @discordx/utilities
```

# 📟 @Category

Create group of commands

## Example

```ts
@Discord()
@Category("Admin Commands")
class Example {
  // commands

  @Slash({ name: "my-command" })
  myCommand(interaction: CommandInteraction) {
    //....
  }
}
```

```ts
// Access data from anywhere
MetadataStorage.instance.applicationCommands.forEach(
  (cmd: DApplicationCommand & ICategory) => {
    if (cmd.category === "Admin Commands") {
      // access
    }
  },
);
```

# 📟 @Description

The description property can be set using this decorator

## Example

```ts
@Discord()
class Example {
  @Slash({ name: "hello" })
  @Description("say hello to bot")
  handle(interaction: CommandInteraction) {
    //....
  }
}
```

Is equivalent to:

```ts
@Discord()
class Example {
  @Slash({ description: "say hello to bot", name: "hello" })
  handle(interaction: CommandInteraction) {
    //....
  }
}
```

# ⚔️ guards

Useful guards created by the discordx team to use in your bot!

## IsGuildUser

A multi purpose guard for guild and user.

### Example

```ts
import { IsGuardUserCallback, IsGuildUser } from "@discordx/utilities";
import { Events } from "discord.js";
import {
  ArgsOf,
  Discord,
  Guard,
  On,
  SimpleCommand,
  SimpleCommandMessage,
} from "discordx";

const OwnerOnly: IsGuardUserCallback = ({ client, user }) => {
  if (!user) {
    return false;
  }

  return client.application?.owner?.id === user.id;
};

@Discord()
@Guard(IsGuildUser(OwnerOnly))
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

## NotBot

Ensure that the handler is only executed for users and not for bots.

### Example

```ts
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

This will work on both Slash and Simple commands

## PermissionGuard

When you are using global commands, but still wish to restrict commands to permissions from roles, then you can use this
guard to easily supply an array of Permissions that a user must have in order to execute the command.

The guard can take an array of permissions or an async resolver to the permission array

### Example

```ts
@Discord()
export class PermissionGuards {
  /**
   * Only allow users with the role "BAN_MEMBERS"
   *
   * @param interaction
   */
  @Slash({ name: "permission_ban_members" })
  @Guard(PermissionGuard(["BAN_MEMBERS"]))
  banMembers1(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * Only allow users with the role "BAN_MEMBERS" with a custom message
   *
   * @param interaction
   */
  @Slash({ name: "permission_ban_members" })
  @Guard(
    PermissionGuard(["BAN_MEMBERS"], {
      content: "You do not have the role `BAN_MEMBERS`",
    }),
  )
  banMembers2(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * get the permissions from an async resolver
   *
   * @param interaction
   */
  @Slash({ name: "permission_ban_members" })
  @Guard(
    PermissionGuard(PermissionGuards.resolvePermission, {
      content: "You do not have the role `BAN_MEMBERS`",
    }),
  )
  banMembers3(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  private static resolvePermission(
    interaction: PermissionHandler,
  ): Promise<PermissionString[]> {
    if (interaction instanceof CommandInteraction) {
      // if guild id is 123
      if (interaction.guildId === "123") {
        return Promise.resolve(["ADD_REACTIONS"]);
      }
    }
    return Promise.resolve(["BAN_MEMBERS"]);
  }
}
```

## Rate limit

This guard will rate limit a user for a specified amount of time. When set, a user can only call a command x amount of
times after that, a cooldown is applied disallowing any more calls to the command until the cooldown is over.

This cooldown starts from the moment the user sends the last message.

If your cooldown is 10 seconds, and you allow 3 calls of your command, the user will have 10 seconds to call it 3 times,
with the timer resetting after each call.

### Example

```ts
@Discord()
class RateLimitExample {
  /**
   * 1 command every 30 seconds with default message
   */
  @Slash({ name: "rate_limit_1" })
  @Guard(RateLimit(TIME_UNIT.seconds, 30))
  rateLimit1(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * Allow 3 command before rate limit of 30 seconds (from last message)
   */
  @Slash({ name: "rate_limit_2" })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      message: "Please wait `30` seconds!",
      rateValue: 3,
    }),
  )
  rateLimit2(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * Rate limit simple command
   *
   * @param message
   */
  @SimpleCommand({ name: "rateLimit" })
  @Guard(RateLimit(TIME_UNIT.seconds, 10))
  private async rateLimitSimpleCommand({
    message,
  }: SimpleCommandMessage): Promise<void> {
    message.reply("It worked!");
  }
}
```

# 🧰 Useful

Here are some helpful functions for accelerating your development.

## EnumChoice

```ts
enum RPS {
  Rock = "0",
  Paper = "1",
  scissors = "2",
}

@SlashChoice(...EnumChoice(RPS))
```

## TimeFormat

### Discord Timestamps

Discord timestamps can be useful for specifying a date/time across multiple users time zones. They work with the Unix Timestamp format and can be posted by regular users as well as bots and applications.

[The Epoch Unix Time Stamp Converter](https://www.unixtimestamp.com/) is a good way to quickly generate a timestamp. For the examples below I will be using the Time Stamp of `1543392060`, which represents `November 28th, 2018` at `09:01:00` hours for my local time zone (GMT+0100 Central European Standard Time).

### Formatting

| Syntax                        | Output             | Output (12-hour clock)               | Output (24-hour clock)            |
| ----------------------------- | ------------------ | ------------------------------------ | --------------------------------- |
| TimeFormat.Default            | `<t:1543392060>`   | November 28, 2018 9:01 AM            | 28 November 2018 09:01            |
| TimeFormat.ShortTime          | `<t:1543392060:t>` | 9:01 AM                              | 09:01                             |
| TimeFormat.LongTime           | `<t:1543392060:T>` | 9:01:00 AM                           | 09:01:00                          |
| TimeFormat.ShortDate          | `<t:1543392060:d>` | 11/28/2018                           | 28/11/2018                        |
| TimeFormat.LongDate           | `<t:1543392060:D>` | November 28, 2018                    | 28 November 2018                  |
| TimeFormat.ShortDateTime      | `<t:1543392060:f>` | November 28, 2018 9:01 AM            | 28 November 2018 09:01            |
| TimeFormat.LongDateTime       | `<t:1543392060:F>` | Wednesday, November 28, 2018 9:01 AM | Wednesday, 28 November 2018 09:01 |
| TimeFormat.RelativeTime       | `<t:1543392060:R>` | 3 years ago                          | 3 years ago                       |
| TimeFormat.StaticRelativeTime | `3 years ago`      | 3 years ago                          | 3 years ago                       |

Whether your output is 12-hour or 24-hour depends on your Discord language setting. For example, if you have your Discord language set to `English, US 🇺🇸`, you will get a 12-hour output. If your Discord language is set to `English, UK 🇬🇧`, you will get a 24-hour output.

Source: https://gist.github.com/LeviSnoot/d9147767abeef2f770e9ddcd91eb85aa

### Example

```ts
import { dayjs, TimeFormat } from "@discordx/utilities";

const message = `I will be there in ${TimeFormat.StaticRelativeTime("31/12/2025", false)}`;
const message = `I will be there by ${TimeFormat.LongDate(
  dayjs({
    day: 31,
    month: 12,
    year: 2025,
  }),
  false,
)}`;
```

# 📜 Documentation

- [discordx.js.org](https://discordx.js.org)
- [Tutorials (dev.to)](https://dev.to/samarmeena/series/14317)

# ☎️ Need help?

- [Check frequently asked questions](https://discordx.js.org/docs/faq)
- [Check examples](https://github.com/discordx-ts/discordx/tree/main/packages/discordx/examples)
- Ask in the community [Discord server](https://discordx.js.org/discord)

# 💖 Thank you

You can support [discordx](https://www.npmjs.com/package/discordx) by giving it a [GitHub](https://github.com/discordx-ts/discordx) star.
