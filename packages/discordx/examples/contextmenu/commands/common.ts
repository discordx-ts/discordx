import type {
  MessageContextMenuInteraction,
  UserContextMenuInteraction,
} from "discord.js";

import { ContextMenu, Discord } from "../../../src/index.js";

@Discord()
export class Example {
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
