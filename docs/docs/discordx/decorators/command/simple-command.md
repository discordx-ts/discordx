---
title: "@SimpleCommand"
sidebar_position: 4
---

Create a simple command handler for messages using `@SimpleCommand`. Example `!hello world`

:::danger
A simple command is dependent on the content of the message but unfortunately, Discord plans to remove message content for verified bots and apps, those with 100 or more servers. Hence, You cannot use simple commands if your bot cannot access message content.

[Read discord message here](https://support-dev.discord.com/hc/en-us/articles/4404772028055-Message-Content-Access-Deprecation-for-Verified-Bots)
:::

## Signature

```ts
SimpleCommand(options: SimpleCommandOptions)
```

## Example

```ts
@Discord()
class Example {
  @SimpleCommand({ aliases: ["perm"], name: "permission" })
  async permission(command: SimpleCommandMessage) {
    command.message.reply("access granted");
  }
}
```

## Execute Commands

You have to manually execute your simple commands by using:

- `client.executeCommand(message)`

This provide flexibility in your code

```ts
import { Client } from "discordx";

async function start() {
  const client = new Client({
    botId: "test",
    simpleCommand: {
      prefix: "!", // define your prefix here
    },
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
    ],
  });

  client.on("messageCreate", (message) => {
    client.executeCommand(message);
  });

  await client.login("YOUR_TOKEN");
}

start();
```

### use custom prefix on a single command

:::warning
Custom prefix on command does not extend client prefix, it simply ignores it.
:::

```ts
@SimpleCommand({ prefix: ["&", ">"] })
race(command: SimpleCommandMessage): void {
  command.sendUsageSyntax();
}
```

### Execute with case sensitive mode

Simple commands can be executed in case-sensitive mode.

**While the mode is disabled (default)**
`!ban === !BAN`

**While the mode is enabled**
`!ban !== !BAN`

### **To enable**

```ts
client.executeCommand(message, { caseSensitive: true });
```
