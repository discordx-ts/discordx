# @Command

Create a simple command handler for messages using `@Command`. Example `!hello world`

# Example

```ts
@Discord()
class commandTest {
  @Command("permcheck", { aliases: ["ptest"] })
  @DefaultPermission(false)
  @Permission({
    id: "462341082919731200",
    type: "USER",
    permission: true,
  })
  async permFunc(message: CommandMessage) {
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
