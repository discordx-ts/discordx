import {
  ContextMenu,
  Discord,
  Guard,
  GuardFunction,
} from "../../../src/index.js";
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
  userHandler(interaction: ContextMenuInteraction): void {
    console.log(`Selected user: ${interaction.targetId}`);
  }
}
