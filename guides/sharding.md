# Sharding

Sharding your bot with `@typeit/discord`.

[TOC]

## Purpose

Sharding is the process of splitting your main discord process into multiple shards to help with the load when your bot is in 2,500+ guilds. Discord.js has recommended to start making updates for sharding at around 2,000 guilds. [Discord.js Sharding Guide]([Getting started | Discord.js Guide](https://discordjs.guide/sharding/#when-to-shard))

When you hit that milestone and need to begin the sharding process this guide will serve as a starting document to help you get set up.

## Before you start

- [ ] Get your bot into 2,000 guilds
- [ ] Ensure your bot compiles down to javascript with `tsc`

### What if my bot is in less than 2,000 servers?

Discord.js has stated

`Sharding is only necessary at 2,500 guilds—at that point, Discord will not allow your bot to login without sharding. With that in mind, you should consider this when your bot is around 2,000 guilds, which should be enough time to get this working. Contrary to popular belief, sharding itself is very simple. It can be complex depending on your bot's needs, however. If your bot is in a total of 2,000 or more servers, then please continue with this guide. Otherwise, it may be a good idea to wait until then.`

However if you are curious you may continue to read this doc! But don't worry about sharding until 2,000 guilds. Focus on building a quality bot as sharding adds more complexity.

### What if my bot does not compile with tsc?

If your bot does not compile with `tsc` but runs with `ts-node` you will **not** be able to shard with the `Discord.js` sharding managers.

I found success with using this `tsconfig.json`

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2020",
    "noImplicitAny": false,
    "sourceMap": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "forceConsistentCasingInFileNames": true,
    "lib": ["es2020", "esnext.asynciterable"],
    "moduleResolution": "node",
    "outDir": "./src/build"
  },
  "exclude": ["node_modules"],
  "indent": [true, "spaces", 2]
}
```

If you are receiving errors that complain about imports. Try using the following import where the compiler complains about the import.

```diff
- import * as fs from 'fs';
+ import fs = require("fs");
```

## I'm Ready

Did you really read the previous section? If not go back and read it.

Okay so now that you are ready let's talk about the set up.

```diff
Bot
├───environments/
├───src/
     ├───app/
        ├───abstract/
        ├───commands/
        ├───const/
        ├───decorators/
        ├───guards/
        ├───handlers/
        ├───models/
        ├───services/
+       ├───entry.bot.ts
+       └───shard.bot.ts

```

I recommend renaming your main entry file where you call `client.login(TOKEN);` to `entry.bot.ts` you can rename it to whatever you'd like just make sure you know that file is where the bot starts. Next you'll need to make a new `shard.bot.ts` file. Again you can name it whatever as long as you know this file is where we will handle sharding.

You don't need to change anything in the `entry.bot.ts` file. The magic will be in the `shard.bot.ts` file.

**Note.** Read the discord.js sharding docs.

You will make a new class in the `shard.bot.ts` file. I have named my class ShardBot

```typescript
export class ShardBot {}
```

Inside this class I have defined a `static start` method that gets called outside of the ShardBot class.

```typescript
export class ShardBot {
  static start(): void {}
}

ShardBot.start();
```

Now that we have the main bits of the Sharding class we need to use the `Discord.js` `ShardingManager` to spawn a shard.

```typescript
import { ShardingManager } from "discord.js";
import { environment } from "../../environments/environment";

export class ShardBot {
  static start(): void {
    const manager = new ShardingManager("./src/build/src/app/entry.bot.js", {
      token: environment.DISCORD_TOKEN,
    });

    manager.on("shardCreate", (shard) => {
      console.log(`Launched shard ${shard.id}`);
    });

    manager.spawn();
  }
}
ShardBot.start();
```

The main thing to note here is that the path in the Instantiation of the `ShardingManager` has the path to the `entry.bot.js` file and not the `.ts` file. The sharding manager requires the bot file to be a `.js` file. This is why you need to ensure you can compile your bot with `tsc`.

The path in there may also be different for your bot so make sure you have the correct path!

## Running

Now that your bot compiles and has the shard file we can run the bot with the sharding class.

`node build/app/shard.bot.js`

will start the shard here.

**Note:** Make sure you provide the correct path to the shard file when running with node.

Once it starts up you should see

```
Launched shard 0
```

in the console.

## That's it

Congrats! Your bot is now using the sharding managers. You can still run the entry file instead of the shard file if you don't want to use sharding until it is needed.
