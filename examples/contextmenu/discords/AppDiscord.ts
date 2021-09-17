import { ContextMenu, Discord } from "../../../src";
import { ContextMenuInteraction } from "discord.js";

@Discord()
export abstract class contextTest {
  @ContextMenu("MESSAGE", "Hello from discord.ts")
  messageHandler(): void {
    console.log("I am message");
  }

  @ContextMenu("USER", "Hello from discord.ts")
  userHandler(interaction: ContextMenuInteraction): void {
    console.log(`Selected user: ${interaction.targetId}`);
  }
}
