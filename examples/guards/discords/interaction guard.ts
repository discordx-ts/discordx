import { ContextMenu, Discord, Guard, GuardFunction } from "../../../src";
import { ContextMenuInteraction } from "discord.js";

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
  async userHandler(interaction: ContextMenuInteraction): Promise<void> {
    console.log(`Selected user: ${interaction.targetId}`);
  }
}
