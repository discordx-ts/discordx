---
title: "@SimpleCommandOption"
---

A simple command can have multiple options (parameters)

:::danger
A simple command is dependent on the content of the message but unfortunately, Discord plans to remove message content for verified bots and apps, those with 100 or more servers. Hence, You cannot use simple commands if your bot cannot access message content.

[Read discord message here](https://support-dev.discord.com/hc/en-us/articles/4404772028055-Message-Content-Access-Deprecation-for-Verified-Bots)
:::

## Signature

```ts
SimpleCommandOption(options: SimpleCommandOptionOptions);
```

## Declare an option

To declare an option you simply use the `@SimpleCommandOption` decorator before a method parameter

```ts
@SimpleCommand()
hello(
  @SimpleCommandOption({ name: "name", type: SimpleCommandOptionType.String }) name: string | undefined,
  command: SimpleCommandMessage
) {
  if (!name) return message.reply("usage: ``!hello <your name>``");
  command.message.reply(`hello ${name}`);
}
```

## Use custom arg splitter

```ts
@SimpleCommand({ argSplitter: "+" })
async add(
  @SimpleCommandOption({ name: "x", type: SimpleCommandOptionType.Integer }) x: number | undefined,
  @SimpleCommandOption({ name: "y", type: SimpleCommandOptionType.Integer }) y: number | undefined,
  command: SimpleCommandMessage
) {
  if (!command.isValid()) return command.sendUsageSyntax();
  return command.message.reply(`${x + y}`);
}
```

## User instance inside DM only

You will receive `ClientUser` if the user mentions the bot in DM. If the user mentions himself/herself, you will receive a `User`. Otherwise, you'll receive an error.

When it comes to guilds, it will always be `GuildMember | User`.
