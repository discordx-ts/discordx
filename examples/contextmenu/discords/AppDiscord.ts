import { ContextMenu, Discord } from "../../../src";
import { ContextMenuInteraction } from "discord.js";

@Discord()
export abstract class contextTest {
  @ContextMenu("MESSAGE", "Hello from discord.ts")
  async messageHandler(): Promise<void> {
    console.log("I am message");
  }

  @ContextMenu("USER", "Hello from discord.ts")
  async userHandler(interaction: ContextMenuInteraction): Promise<void> {
    console.log(`Selected user: ${interaction.targetId}`);
  }
}
