import type { ContextMenuInteraction } from "discord.js";

import type { GuardFunction } from "../../../src/index.js";
import { ContextMenu, Discord, Guard } from "../../../src/index.js";

export const InteractionGuard: GuardFunction<ContextMenuInteraction> = async (
  interaction,
  client,
  next
) => {
  await next();
};

@Discord()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Example {
  @ContextMenu("USER", "Check details")
  @Guard(InteractionGuard)
  userHandler(interaction: ContextMenuInteraction): void {
    console.log(`Selected user: ${interaction.targetId}`);
  }
}
