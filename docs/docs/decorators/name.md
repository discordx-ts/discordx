# @Name

This decorator is a shortcut to set the name property

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

[@Discord](/docs/decorators/discord)

[@SimpleCommand](/docs/decorators/simeplcommand)

[@Slash](/docs/decorators/slash)
