# @SlashOption

A slash command can have multiple options (parameters)

> query is an option in this image

![](../../../static/img/options.png)

## Declare an option

To declare an option you simply use the `@SlashOption` decorator before a method parameter

```ts
@Discord()
class DiscordBot {
  @Slash("add")
  add(
    @SlashOption("x", { description: "x value" })
    x: number,
    @SlashOption("y", { description: "y value" })
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
    @SlashOption("x", { description: "x value" })
    x: number, // :number, options are both INTEGER
    @SlashOption("y", { description: "y value" })
    y: number, // :number, options are both INTEGER

    interaction: CommandInteraction
  ) {
    interaction.reply(String(x + y));
  }
}
```

## Manual typing

If you want to specify the type manually you can do it:

```ts
import { TextChannel, VoiceChannel, CommandInteraction } from "discord.js";

@Discord()
class DiscordBot {
  @Slash("getID")
  getID(
    @SlashOption("x", { type: "MENTIONABLE" })
    mentionable: GuildMember | User | Role,

    interaction: CommandInteraction
  ) {
    interaction.reply(mentionable.id);
  }
}
```

## Type inferance

- `"STRING"`
  **Infered from `String`**

  ```ts
  fn(
    @SlashOption("x")
    channel: string,
  )
  ```

- `"BOOLEAN"`
  **Infered from `Boolean`**

  ```ts
  fn(
    @SlashOption("x")
    channel: boolean,
  )
  ```

- `"INTEGER"`
  **Infered from `Number`**

  ```ts
  fn(
    @SlashOption("x")
    channel: number,
  )
  ```

- `"ROLE"`
  **Infered from `Role`**

  ```ts
  fn(
    @SlashOption("x")
    channel: Role,
  )
  ```

- `"USER"`
  **Infered from `User` | `GuildMember` (you will recieve GuildMember if present otherwise User)**

  ```ts
  fn(
    @SlashOption("x")
    channel: User,
  )
  ```

- `"CHANNEL"`
  **Infered from `Channel` (or `TextChannel` / `VoiceChannel`, not recommended)**

  ```ts
  fn(
    @SlashOption("x")
    channel: Channel,
  ```

- `"MENTIONABLE"`
  **No inferance, use:**

  ```ts
  fn(
    @SlashOption("x", { type: "MENTIONABLE" })
    channel: GuildMember | User | Role,
  )
  ```

- `"SUB_COMMAND"`
  No inferance, use [@SlashGroup](/docs/decorators/commands/slashgroup)
- `"SUB_COMMAND_GROUP"`
  No inferance, use [@SlashGroup](/docs/decorators/commands/slashgroup)

## Signature

```ts
SlashOption(name: string);
SlashOption(
  name: string,
  params?: SlashOptionParams
)
```

## Parameters

### name

`string`

The option name

### SlashOptionType

#### Description

`string`
`OPTION_NAME - OPTION_TYPE` by default

You can set the description of the option

#### Required

`bool` `default: false`

The option is required or not

#### Type

`"USER" | "STRING" | "BOOLEAN" | "INTEGER" | "NUMBER" | "CHANNEL" | "ROLE" | "MENTIONABLE" | undefined`

`default: STRING`

Slash option input type

## Set the default required value

if you want to set the default required value, you can use `client.requiredByDefault`

```ts
const client = new Client({
  botId: "test",
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  classes: [
    // glob string to load the classes. If you compile your bot, the file extension will be .js
    `${__dirname}/discords/*.{js,ts}`,
  ],
  silent: false,
  requiredByDefault: true,
});
```

## Autocompletion (Option's choices)

You can use the [@SlashChoice](/docs/decorators/commands/slashchoice) decorator

## Option order

**You have to put required options before optional ones**  
Or you will get this error:

```
(node:64399) UnhandledPromiseRejectionWarning: DiscordAPIError: Invalid Form Body
options[1]: Required options must be placed before non-required options
```
