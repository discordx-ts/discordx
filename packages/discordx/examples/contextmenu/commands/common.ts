import type {
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { ApplicationCommandType } from "discord.js";

import { ContextMenu, Discord } from "../../../src/index.js";

@Discord()
export class Example {
  @ContextMenu(ApplicationCommandType.Message, "Hello from discord.ts")
  messageHandler(interaction: MessageContextMenuCommandInteraction): void {
    console.log("I am message");
    interaction.reply("message interaction works");
  }

  @ContextMenu(ApplicationCommandType.User, "Hello from discord.ts")
  userHandler(interaction: UserContextMenuCommandInteraction): void {
    console.log(`Selected user: ${interaction.targetId}`);
    interaction.reply("user interaction works");
  }
}
