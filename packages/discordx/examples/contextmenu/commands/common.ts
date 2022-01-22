import { ContextMenu, Discord } from "../../../src/index.js";
import {
  MessageContextMenuInteraction,
  UserContextMenuInteraction,
} from "discord.js";

@Discord()
export abstract class contextTest {
  @ContextMenu("MESSAGE", "Hello from discord.ts")
  messageHandler(interaction: MessageContextMenuInteraction): void {
    console.log("I am message");
    interaction.reply("message interaction works");
  }

  @ContextMenu("USER", "Hello from discord.ts")
  userHandler(interaction: UserContextMenuInteraction): void {
    console.log(`Selected user: ${interaction.targetId}`);
    interaction.reply("user interaction works");
  }
}
