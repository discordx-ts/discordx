# @Reaction

Create a reaction handler for messages using `@Reaction`.

## Example

```ts
@Discord()
class Example {
  @Reaction("📌")
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
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
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
@Reaction("📌", { aliases: ["📍", "custom_emoji"] })
async pin(reaction: MessageReaction): Promise<void> {
  await reaction.message.pin();
}
```

### Retain Reactions

By default, reactions will be removed when being executed. To prevent this, set the `delete` option to `false`.

```ts
@Reaction("⭐", { remove: false })
async starReaction(reaction: MessageReaction, user: User): Promise<void> {
  await reaction.message.reply(`Received a ${reaction.emoji} from ${user}`);
}
```

## Signature

```ts
Reaction(name: string, options: ReactionOptions)
```

## Parameters

### name

The reaction emoji, either unicode, custom emoji name, or custom emoji snowflake.
| type | default | required |
| ------ | ------- | -------- |
| string | | Yes |

### options

Multiple options, check below.
| type | default | required |
| ------ | --------- | -------- |
| object | undefined | No |

#### `remove`

Whether or not to remove the reaction upon execution.
| type | default |
| ------- | ------- |
| boolean | true |

#### `aliases`

Alternative emojis for this reaction handler.
| type | default |
| --------- | ------- |
| string[ ] | [ ] |

#### `partial`

If enabled, discord.ts will not fetch the reaction or user when they are partial.
| type | default |
| ------- | ------- |
| boolean | false |

#### `Description`

A description of what the reaction does.
| type | default |
| ------ | ------- |
| string | |

#### `botIds`

Array of bot ids which the reaction will be executed on.
| type | default |
| --------- | ------- |
| string[ ] | [ ] |

#### `directMessage`

Allow reaction execution from direct messages.
| type | default |
| ------- | ------- |
| boolean | true |

#### `guilds`

Array of guild ids which the reaction will be executed in.
| type | default |
| ------------ | ------- |
| Snowflake[ ] | [ ] |
