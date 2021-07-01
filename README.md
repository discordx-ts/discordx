<p align="center">
  <br/>
  <img src="https://i.imgur.com/kSLOEIF.png" width="150px">
  <br/>
  <br/>
  <h1 align="center">
    <p  align="center">
      discord.ts (@typeit/discord)
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
**[https://owencalvin.github.io/discord.ts/](https://owencalvin.github.io/discord.ts/)**

# 📟 @Slash - Discord commands
Discord has it's own command system now, you can simply declare commands and use Slash commands this way

```ts
import { Discord, Slash } from "@typeit/discord";
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

# ⚔️ Guards
We implemented a guard system thats work pretty like the [Koa](https://koajs.com/) middleware system

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

# 📡 Installation
Use [npm](https://www.npmjs.com/package/@typeit/discord) or yarn to install **@typeit/discord@slash** with **discord.js**

**[Please refer to the documentation](https://owencalvin.github.io/discord.ts/installation/#installation)**


# ☎️ Need help?

**[Simply join the Discord server](https://discord.gg/VDjwu8E)**  

You can also find help with the [different projects that use discord.ts](https://github.com/OwenCalvin/discord.ts/network/dependents?package_id=UGFja2FnZS00Njc1MzYwNzU%3D) and in the [examples folder](https://github.com/OwenCalvin/discord.ts/tree/master/examples)
