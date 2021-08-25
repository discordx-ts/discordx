# @SimpleCommandOption

A simple command can have multiple options (parameters)

:::danger
A simple command is dependent on the content of the message but unfortunately, Discord plans to remove message content for verified bots and apps, those with 100 or more servers. Hence, You cannot use simple commands if your bot cannot access message content.

[Read discord message here](https://support-dev.discord.com/hc/en-us/articles/4404772028055-Message-Content-Access-Deprecation-for-Verified-Bots)
:::

## Declare an option

To declare an option you simply use the `@SimpleCommandOption` decorator before a method parameter

```ts
  @SimpleCommand("hello")
  async testCommand(
    @SimpleCommandOption("name") name: string,
    command: SimpleCommandMessage
  ) {
    if (!name) return message.reply("usage: ``!hello <your name>``");
    message.reply(`hello ${name}`);
  }
```

## Use custom arg splitter

```ts
  @SimpleCommand("add", { argSplitter: "+" })
  async add(
    @SimpleCommandOption("x") x: number,
    @SimpleCommandOption("y") y: number,
    command: SimpleCommandMessage
  ): Promise<unknown> {
    if (!command.isValid()) return command.sendUsageSyntax();
    return command.message.reply(`${x + y}`);
  }
```

## Type inferance

- `"STRING"`
  **Infered from `String`**

  ```ts
  fn(
    @SimpleCommandOption("x")
    channel: string,
  )
  ```

- `"BOOLEAN"`
  **Infered from `Boolean`**

  ```ts
  fn(
    @SimpleCommandOption("x")
    channel: boolean,
  )
  ```

- `"INTEGER"`
  **Infered from `Number`**

  ```ts
  fn(
    @SimpleCommandOption("x")
    channel: number,
  )
  ```

- `"ROLE"`
  **Infered from `Role`**

  ```ts
  fn(
    @SimpleCommandOption("x")
    channel: Role,
  )
  ```

- `"USER"`
  **Infered from `User` | `GuildMember` (you will recieve GuildMember if present otherwise User)**

  ```ts
  fn(
    @SimpleCommandOption("x")
    channel: User,
  )
  ```

- `"CHANNEL"`
  **Infered from `Channel` (or `TextChannel` / `VoiceChannel`, not recommended)**

  ```ts
  fn(
    @SimpleCommandOption("x")
    channel: Channel,
  ```

- `"MENTIONABLE"`
  **No inferance, use:**

  ```ts
  fn(
    @SimpleCommandOption("x", { type: "MENTIONABLE" })
    channel: GuildMember | User | Role,
  )
  ```

## Signature

```ts
SimpleCommandOption( name: string, params?: { description?: string; type?: "STRING | INTEGER | NUMBER | BOOLEAN | USER | CHANNEL | ROLE | MENTIONABLE" } );
```

## Parameters

### name

`string`
The name of your command option

### params

`object`

Multiple options, check below.

#### description

`string`
The description of command option

#### type

`STRING | INTEGER | NUMBER | BOOLEAN | USER | CHANNEL | ROLE | MENTIONABLE`

The type of your command option
