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
export abstract class contextTest {
  @ContextMenu("USER", "Check details")
  @Guard(InteractionGuard)
  userHandler(interaction: ContextMenuInteraction): void {
    console.log(`Selected user: ${interaction.targetId}`);
  }
}
