/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
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
  async messageHandler(
    interaction: MessageContextMenuCommandInteraction,
  ): Promise<void> {
    console.log("I am message");
    await interaction.reply("message interaction works");
  }

  @ContextMenu({
    name: "Hello from discordx",
    type: ApplicationCommandType.User,
  })
  async userHandler(
    interaction: UserContextMenuCommandInteraction,
  ): Promise<void> {
    console.log(`Selected user: ${interaction.targetId}`);
    await interaction.reply("user interaction works");
  }
}
