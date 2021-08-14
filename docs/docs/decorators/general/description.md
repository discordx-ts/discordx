# @Description

This decorator is a shortcut to set the description property.

This decorator doesn't modify anything for the user to see, it is entirely a developer feature.

:::danger
This decorator may be removed in future.
:::

```typescript
import { CommandInteraction } from "discord.js";

@Discord()
export abstract class DiscordBot {
  @Slash("ciao")
  @Description("say ciao")
  async ciao(interaction: CommandInteraction) {
    interaction.reply("Ciao!");
  }
}
```

Is equivalent to:

```typescript
import { CommandInteraction } from "discord.js";

@Discord()
export abstract class DiscordBot {
  @Slash("ciao", { description: "say ciao" })
  async ciao(interaction: CommandInteraction) {
    interaction.reply("Ciao!");
  }
}
```

## Make changes to

It either extends or overwrites data configured in below decorators, however, the order of decorators matters.

[@SimpleCommand](/docs/decorators/commands/simplecommand)

[@Slash](/docs/decorators/commands/slash)
