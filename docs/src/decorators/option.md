# Option
A Slash Command can have multiple options (parameters)

> query is an option in this image

![](/discord.ts/options.png)

## Declare an option
To declare an option you simply use the `@Option` decorator before a method parameter
```ts
@Discord()
class DiscordBot {
  @Slash("add")
  add(
    @Option("x", { description: "x value" })
    x: number,
    @Option("y", { description: "y value" })
    y: number,

    interaction: CommandInteraction
  ) {
    interaction.reply(String(x + y));
  }
}
```

## Automatic typing
An option infer the type from TypeScript in this example, discord.**ts** knows that your options are both `number` because you typed the parameters

discord.**ts** convert automatically the infered type into discord.**js** options types

```ts
@Discord()
class DiscordBot {
  @Slash("add")
  add(
    @Option("x", { description: "x value" })
    x: number, // :number, options are both INTEGER
    @Option("y", { description: "y value" })
    y: number, // :number, options are both INTEGER

    interaction: CommandInteraction
  ) {
    interaction.reply(String(x + y));
  }
}
```

## Manual typing
If you want to specify the type manually you can do it
```ts
import { TextChannel, VoiceChannel, CommandInteraction } from "discord.js"

@Discord()
class DiscordBot {
  @Slash("getID")
  getID(
    @Option("x", "CHANNEL")
    channel: TextChannel | VoiceChannel,

    interaction: CommandInteraction
  ) {
    interaction.reply(channel.id);
  }
}
```

## Params
The parameters of an @Option is an object as the last parameter

### Description
`string`  
`OPTION_NAME - OPTION_TYPE` by default 

You can set the description of the option

### Required
`bool`  
`false` by default      

The option is required or not

## Set the default required value
if you want to set the default required value, you can use `client.requiredByDefault`

```ts
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
  classes: [
    `${__dirname}/*Discord.ts`, // glob string to load the classes
    `${__dirname}/*Discord.js`, // If you compile using "tsc" the file extension change to .js
  ],
  silent: false,
  requiredByDefault: true
});
```

## Autocompletion (Option's choices)
You can use the [@Choice](/decorators/choice/) decorator
