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

## Signature

```ts
SimpleCommandOption( name: string, params?: { description?: string; type?: "STRING | NUMBER | BOOLEAN | USER | CHANNEL | ROLE" } ): ParameterDecoratorEx;
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

`STRING | NUMBER | BOOLEAN | USER | CHANNEL | ROLE`

The type of your command option
