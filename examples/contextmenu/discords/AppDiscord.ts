import { ContextMenu, Discord } from "../../../build/cjs/index.js";
import { UserContextMenuInteraction } from "discord.js";

@Discord()
export abstract class contextTest {
  @ContextMenu("MESSAGE", "Hello from discord.ts")
  messageHandler(): void {
    console.log("I am message");
  }

  @ContextMenu("USER", "Hello from discord.ts")
  userHandler(interaction: UserContextMenuInteraction): void {
    console.log(`Selected user: ${interaction.targetId}`);
  }
}
