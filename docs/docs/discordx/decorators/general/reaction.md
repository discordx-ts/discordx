# @Reaction

Create a reaction handler for messages using `@Reaction`.

## Example

```ts
@Discord()
class Example {
  @Reaction({ emoji: "📌" })
  async pin(reaction: MessageReaction): Promise<void> {
    await reaction.message.pin();
  }
}
```

### Execute Reactions

You have to manually execute your reactions by using `client.executeReaction(reaction, user)`

```ts
import { Client } from "discordx";
import { Partials } from "discord.js";

async function start() {
  const client = new Client({
    botId: "test",
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction], // Necessary to receive reactions for uncached messages
  });

  client.on("messageReactionAdd", (reaction, user) => {
    client.executeReaction(reaction, user);
  });

  await client.login("YOUR_TOKEN");
}

start();
```

### Aliasing Reactions

```ts
@Discord()
class Example {
  @Reaction({ aliases: ["📍", "custom_emoji"], emoji: "📌" })
  async pin(reaction: MessageReaction): Promise<void> {
    await reaction.message.pin();
  }
}
```

### Remove Reactions

By default, reactions will not be removed when being executed. To prevent this, set the `remove` option to `true`.

```ts
@Discord()
class Example {
  @Reaction({ emoji: "⭐", remove: true })
  async starReaction(reaction: MessageReaction, user: User): Promise<void> {
    await reaction.message.reply(`Received a ${reaction.emoji} from ${user}`);
  }
}
```

## Signature

```ts
Reaction(options?: ReactionOptions)
```
