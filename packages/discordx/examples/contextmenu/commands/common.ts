import type {
  ContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { ApplicationCommandType } from "discord.js";

import { ContextMenu, Discord } from "../../../src/index.js";

@Discord()
export abstract class contextTest {
  @ContextMenu(ApplicationCommandType.Message, "Hello from discord.ts")
  messageHandler(interaction: ContextMenuCommandInteraction): void {
    console.log("I am message");
    interaction.reply("message interaction works");
  }

  @ContextMenu(ApplicationCommandType.User, "Hello from discord.ts")
  userHandler(interaction: UserContextMenuCommandInteraction): void {
    console.log(`Selected user: ${interaction.targetId}`);
    interaction.reply("user interaction works");
  }
}
