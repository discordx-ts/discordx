<div>
  <p align="center">
    <a href="https://discord-ts.js.org" target="_blank" rel="nofollow">
      <img src="https://discord-ts.js.org/discord-ts.svg" width="546" />
    </a>
  </p>
  <p align="center">
    <a href="https://discord.gg/yHQY9fexH9"
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
class SlashExample {
  // commands

  @Slash()
  @NickName("test")
  myCommand(interaction: CommandInteraction) {
    //....
  }
}
```

```ts
// Access data from anywhere
import { CategoryMetaData } from "@discord/utilities";

// access admin commands
CategoryMetaData.get("Admin Commands");
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
export abstract class RateLimitExample {
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
   * @param message
   * @private
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

This will work on both Slash and Simple commands

# ☎️ Need help?

Ask in **[discord server](https://discord.gg/yHQY9fexH9)** or open
a **[issue](https://github.com/oceanroleplay/discord.ts/issues)**

# Thank you

Show your support for [discordx](https://www.npmjs.com/package/discordx) by giving us a star
on [github](https://github.com/oceanroleplay/discord.ts).
