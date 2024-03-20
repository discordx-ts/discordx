/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type {
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { ApplicationCommandType } from "discord.js";
import { ContextMenu, Discord } from "discordx";

@Discord()
export class Example {
  @ContextMenu({
    name: "Hello from discordx",
    type: ApplicationCommandType.Message,
  })
  messageHandler(interaction: MessageContextMenuCommandInteraction): void {
    console.log("I am message");
    interaction.reply("message interaction works");
  }

  @ContextMenu({
    name: "Hello from discordx",
    type: ApplicationCommandType.User,
  })
  userHandler(interaction: UserContextMenuCommandInteraction): void {
    console.log(`Selected user: ${interaction.targetId}`);
    interaction.reply("user interaction works");
  }
}
