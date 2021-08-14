# @Name

This decorator is a shortcut to set the name property.

:::danger
This decorator may be removed in future.
:::

## Example

```typescript
import { CommandInteraction } from "discord.js";

@Discord()
export abstract class DiscordBot {
  @Slash("myslash")
  @Name("yourslash")
  async ciao(interaction: CommandInteraction) {
    // name of slash overwritten
    interaction.reply("Ciao!");
  }
}
```

Is equivalent to:

```typescript
import { CommandInteraction } from "discord.js";

@Discord()
export abstract class DiscordBot {
  @Slash("ciao")
  async ciao(interaction: CommandInteraction) {
    interaction.reply("Ciao!");
  }
}
```

## Make changes to

It either extends or overwrites data configured in below decorators, however, the order of decorators matters.

[@Discord](/docs/decorators/general/discord)

[@SimpleCommand](/docs/decorators/commands/simplecommand)

[@Slash](/docs/decorators/commands/slash)
