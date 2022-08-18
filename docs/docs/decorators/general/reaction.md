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

async function start() {
  const client = new Client({
    botId: "test",
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
    ],
    partials: ["MESSAGE", "CHANNEL", "REACTION"], // Necessary to receive reactions for uncached messages
  });

  client.on("messageReactionAdd", (reaction, user) => {
    this.Client.executeReaction(reaction, user);
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

## Parameters

### options

The reaction options

| type            | default   | required |
| --------------- | --------- | -------- |
| ReactionOptions | undefined | No       |

## Type: ReactionOptions

### aliases

Alternative emojis for this reaction handler.

| type      | default |
| --------- | ------- |
| string[ ] | [ ]     |

### botIds

Array of bot ids which the reaction will be executed on.

| type      | default |
| --------- | ------- |
| string[ ] | [ ]     |

### description

A description of what the reaction does.

| type   | default |
| ------ | ------- |
| string |         |

### directMessage

Allow reaction execution from direct messages.

| type    | default |
| ------- | ------- |
| boolean | true    |

### emoji

The reaction emoji, either unicode, custom emoji name, or custom emoji snowflake.

| type   | default     |
| ------ | ----------- |
| string | method name |

### guilds

Array of guild ids which the reaction will be executed in.

| type         | default |
| ------------ | ------- |
| Snowflake[ ] | [ ]     |

### partial

If enabled, discordx will not fetch the reaction or user when they are partial.

| type    | default |
| ------- | ------- |
| boolean | false   |

### remove

Whether or not to remove the reaction upon execution.

| type    | default |
| ------- | ------- |
| boolean | true    |
