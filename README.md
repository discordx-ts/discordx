# Why discordx?

For [@typeit/discord](https://www.npmjs.com/package/@typeit/discord), we have created fixes and new features. Likewise, We have also requested our fixes and new features on original package at [OwenCalvin/discord.ts/pull/62](https://github.com/OwenCalvin/discord.ts/pull/62).

But with `discordx` we intend to provide latest upto date package to build bots with many features, such as multi-bot, simple commands, etc.

⚠️ This package is updated daily with discord.js v13 updates. If you are using this package, make sure you keep it up to date.

If you have any issues or feature requests, Open an issue at Github [click here](https://github.com/oceanroleplay/discord.ts/issues)

# New features

- added multiple bot support
- added new interactions: `@Button @SelectMenu`
- added `@Command` to support v4 commands
- added new decorator `@DefaultPermission`
- add new init slash method
- Code improved with lint
- added more example for new decorators

# Package

Maintained by [@oceanroleplay](https://github.com/oceanroleplay)

Package by [@OwenCalvin](https://github.com/OwenCalvin)

---

<p align="center">
  <br/>
  <img src="https://i.imgur.com/kSLOEIF.png" width="150px">
  <br/>
  <br/>
  <h1 align="center">
    <p  align="center">
      discord.ts (discordx or @typeit/discord)
    </p>
  </h1>
    <p align="center">
      <b>
        Create your discord bot by using TypeScript and decorators!  
      </b>
    <p>
  </p>
  <br/>
</p>

# 🎻 Introduction

This module is an extension of **[discord.**js**](https://discordjs.guide/)**, so the internal behavior (methods, properties, ...) is the same.

This library allows you to use TypeScript decorators on discord.**js**, it simplify your code and improve the readability !

# 📜 Documentation

**[https://oceanroleplay.github.io/discord.ts/](https://oceanroleplay.github.io/discord.ts/)**

# 📟 @Slash - Discord commands

Discord has it's own command system now, you can simply declare commands and use Slash commands this way

```ts
import { Discord, Slash } from "discordx";
import { CommandInteraction } from "discord.js";

@Discord()
abstract class AppDiscord {
  @Slash("hello")
  private hello(
    @Option("text")
    text: string,
    interaction: CommandInteraction
  ) {
    // ...
  }
}
```

## Decorators related to Slash commands

There is a whole system that allows you to implement complex Slash commands

- `@Choice`
- `@Choices`
- `@Option`
- `@Permission`
- `@Guild`
- `@Group`
- `@Description`
- `@Guard`

# 💡@On / @Once - Discord events

We can declare methods that will be executed whenever a Discord event is triggered.

Our methods must be decorated with the `@On(event: string)` or `@Once(event: string)` decorator.

That's simple, when the event is triggered, the method is called:

```typescript
import { Discord, On, Once } from "discordx";

@Discord()
abstract class AppDiscord {
  @On("messageCreate")
  private onMessage() {
    // ...
  }

  @Once("messageDelete")
  private onMessageDelete() {
    // ...
  }
}
```

# ⚔️ Guards

We implemented a guard system thats work pretty like the [Koa](https://koajs.com/) middleware system

You can use functions that are executed before your event to determine if it's executed. For example, if you want to apply a prefix to the messages, you can simply use the `@Guard` decorator.

The order of execution of the guards is done according to their position in the list, so they will be executed in order (from top to bottom).

Guards can be set for `@Slash`, `@On`, `@Once`, `@Discord` and globaly.

```typescript
import { Discord, On, Client, Guard } from "discordx";
import { NotBot } from "./NotBot";
import { Prefix } from "./Prefix";

@Discord()
abstract class AppDiscord {
  @On("messageCreate")
  @Guard(
    NotBot, // You can use multiple guard functions, they are excuted in the same order!
    Prefix("!")
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

# 📡 Installation

Use [npm](https://www.npmjs.com/package/discordx) or yarn to install **discordx** with **discord.js**

**[Please refer to the documentation](https://oceanroleplay.github.io/discord.ts/installation/#installation)**

# ☎️ Need help?

**[Simply join the Discord server](https://discord.gg/VDjwu8E)**

You can also find help with the [examples folder](https://github.com/oceanroleplay/discord.ts/tree/slashx/examples)

# Thank you
