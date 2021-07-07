# @Description

This decorator is a shortcut to set the description property

```typescript
import { ClassCommand, Command, CommandMessage } from "@typeit/discord";
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
import { ClassCommand, Command, CommandMessage } from "@typeit/discord";
import { CommandInteraction } from "discord.js";

@Discord()
export abstract class DiscordBot {
  @Slash("ciao", { description: "say ciao" })
  async ciao(interaction: CommandInteraction) {
    interaction.reply("Ciao!");
  }
}
```
