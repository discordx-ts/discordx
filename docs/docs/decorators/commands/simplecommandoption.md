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
    @SimpleCommandOption("name", { type: "STRING" }) name: string | undefined,
    command: SimpleCommandMessage
  ) {
    if (!name) return message.reply("usage: ``!hello <your name>``");
    command.message.reply(`hello ${name}`);
  }
```

## Use custom arg splitter

```ts
  @SimpleCommand("add", { argSplitter: "+" })
  async add(
    @SimpleCommandOption("x", { type: "INTEGER" }) x: number | undefined,
    @SimpleCommandOption("y", { type: "INTEGER" }) y: number | undefined,
    command: SimpleCommandMessage
  ) {
    if (!command.isValid()) return command.sendUsageSyntax();
    return command.message.reply(`${x + y}`);
  }
```

## Type inference

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
  **No inference, use:**

  ```ts
  fn(
    @SimpleCommandOption("x", { type: "MENTIONABLE" })
    channel: GuildMember | User | Role,
  )
  ```

## Signature

```ts
SimpleCommandOption( name: string, options?: { description?: string; type?: "STRING | INTEGER | NUMBER | BOOLEAN | USER | CHANNEL | ROLE | MENTIONABLE" } );
```

## Parameters

### name

The name of your command option

| type   | default | required |
| ------ | ------- | -------- |
| string |         | Yes      |

### options

Multiple options, check below.

| type   | default   | required |
| ------ | --------- | -------- |
| object | undefined | No       |

#### `description`

The description of command option

| type   | default      |
| ------ | ------------ |
| string | Command type |

#### `type`

The type of your command option

| type                                                                             | default   |
| -------------------------------------------------------------------------------- | --------- |
| STRING \| INTEGER \| NUMBER \| BOOLEAN \| USER \| CHANNEL \| ROLE \| MENTIONABLE | inference |
