<div>
  <p align="center">
    <a href="https://discord-ts.js.org" target="_blank" rel="nofollow">
      <img src="https://discord-ts.js.org/discord-ts.svg" width="546" />
    </a>
  </p>
  <p align="center">
    <a href="https://discord-ts.js.org/discord"
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
    <a href="https://github.com/oceanroleplay/discord.ts/actions"
      ><img
        src="https://github.com/oceanroleplay/discord.ts/workflows/Build/badge.svg"
        alt="Build status"
    /></a>
    <a href="https://www.paypal.me/vijayxmeena"
      ><img
        src="https://img.shields.io/badge/donate-paypal-F96854.svg"
        alt="paypal"
    /></a>
  </p>
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
  - [Rate Limit](#rate-limit)
  - [NotBot](#notbot)
- [Useful](#-useful)
  - [EnumChoice](#enumchoice)

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

  @Slash()
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
  }
);
```

# 📟 @Description

The description property can be set using this decorator

## Example

```ts
@Discord()
class Example {
  @Slash("hello")
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
  @Slash("hello", { description: "say hello to bot" })
  handle(interaction: CommandInteraction) {
    //....
  }
}
```

# ⚔️ guards

Useful guards created by the Discord.ts team to use in your bot!

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
  @Slash("rate_limit_1")
  @Guard(RateLimit(TIME_UNIT.seconds, 30))
  rateLimit1(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * Allow 3 command before rate limit of 30 seconds (from last message)
   */
  @Slash("rate_limit_3")
  @Guard(RateLimit(TIME_UNIT.seconds, 30, "Please wait `30` seconds!", 3))
  rateLimit3(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * Rate limit simple command
   *
   * @param message
   */
  @SimpleCommand("rateLimit")
  @Guard(RateLimit(TIME_UNIT.seconds, 10))
  private async rateLimitSimpleCommand({
    message,
  }: SimpleCommandMessage): Promise<void> {
    message.reply("It worked!");
  }
}
```

## NotBot

```ts
@SimpleCommand("hello")
@Guard(NotBot)
hello({ message }: SimpleCommandMessage): void {
  message.reply("It worked!");
}
```

This will work on both Slash and Simple commands

## PermissionGuard

When you are using global commands, but still wish to restrict commands to permissions from roles, then you can use this guard to easily supply an array of Permissions that a user must have in order to execute the command.

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
  @Slash("permission_ban_members")
  @Guard(PermissionGuard(["BAN_MEMBERS"]))
  banMembers1(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * Only allow users with the role "BAN_MEMBERS" with a custom message
   *
   * @param interaction
   */
  @Slash("permission_ban_members")
  @Guard(
    PermissionGuard(["BAN_MEMBERS"], "You do not have the role `BAN_MEMBERS`")
  )
  banMembers2(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  /**
   * get the permissions from an async resolver
   *
   * @param interaction
   */
  @Slash("permission_ban_members")
  @Guard(
    PermissionGuard(
      PermissionGuards.resolvePermission,
      "You do not have the role `BAN_MEMBERS`"
    )
  )
  banMembers3(interaction: CommandInteraction): void {
    interaction.reply("It worked!");
  }

  private static resolvePermission(): Promise<PermissionString[]> {
    return Promise.resolve(["BAN_MEMBERS"]);
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

# ☎️ Need help?

Ask in **[discord server](https://discord-ts.js.org/discord)** or open
a **[issue](https://github.com/oceanroleplay/discord.ts/issues)**

# Thank you

Show your support for [discordx](https://www.npmjs.com/package/discordx) by giving us a star
on [github](https://github.com/oceanroleplay/discord.ts).
