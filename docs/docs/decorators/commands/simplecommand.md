# @SimpleCommand

Create a simple command handler for messages using `@SimpleCommand`. Example `!hello world`

:::danger
A simple command is dependent on the content of the message but unfortunately, Discord plans to remove message content for verified bots and apps, those with 100 or more servers. Hence, You cannot use simple commands if your bot cannot access message content.

[Read discord message here](https://support-dev.discord.com/hc/en-us/articles/4404772028055-Message-Content-Access-Deprecation-for-Verified-Bots)
:::

## Example

```ts
@Discord()
class commandTest {
  @SimpleCommand("permcheck", { aliases: ["ptest"] })
  @DefaultPermission(false)
  @Permission({
    id: "462341082919731200",
    type: "USER",
    permission: true,
  })
  async permFunc(command: SimpleCommandMessage) {
    message.reply("access granted");
  }
}
```

## Execute Commands

You have to manualy execute your simple commands by using:

- `client.executeCommand(message)`

This provide flexibility in your code

```ts
import { Client } from "discordx";

async function start() {
  const client = new Client({
    botId: "test",
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  });

  client.on("messageCreate", (message) => {
    client.executeCommand(message);
  });

  await client.login("YOUR_TOKEN");
}

start();
```

## Signature

```ts
SimpleCommand(name: string, params: SimpleCommandParams)
```

## Parameters

### Name

The simple command name.

| type   | default | required |
| ------ | ------- | -------- |
| string |         | Yes      |

:::caution
Make sure your command name is compitable with regex `a-z A-Z0-9`
:::

### SimpleCommandParams

Multiple options, check below.

| type   | default   | required |
| ------ | --------- | -------- |
| object | undefined | No       |

#### `aliases`

Alternative names for simple commands.

| type      | default |
| --------- | ------- |
| string[ ] | [ ]     |

#### `Description`

The simple command description.

| type   | default      |
| ------ | ------------ |
| string | Command name |

#### `argSplitter`

Splitter for arguments used with @SimpleCommandOption

| type   | default           |
| ------ | ----------------- |
| string | Single whitespace |

#### `botIds`

Array of bot ids, for which only the command will be executed.

| type      | default |
| --------- | ------- |
| string[ ] | [ ]     |

#### `defaultPermission`

When true, the command can be used by anyone except those who have been denied by the @Permission decorator, vice versa.

| type    | default |
| ------- | ------- |
| boolean | true    |

#### `directMessage`

Allow command execution from direct messages.

| type    | default |
| ------- | ------- |
| boolean | true    |

#### `guilds`

Array of guild ids, for which only the command will be executed.

| type        | default |
| ----------- | ------- |
| Snowflake[] | [ ]     |
