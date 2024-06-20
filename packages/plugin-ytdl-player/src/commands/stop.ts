/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import type { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";

import { musicPlayerManager } from "../core/index.js";

@Discord()
@SlashGroup("music")
export class Command {
  @Slash({ description: "Stop music player", name: "stop" })
  async stop(interaction: CommandInteraction): Promise<void> {
    const cmd = await musicPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    queue.exit();
    await interaction.followUp({
      content: "> adios amigo, see you later!",
    });
  }
}
