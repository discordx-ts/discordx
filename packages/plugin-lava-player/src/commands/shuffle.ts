/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import type { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";

import { lavaPlayerManager } from "../core/manager.js";

@Discord()
@SlashGroup("music")
export class Command {
  @Slash({ description: "Shuffle queue", name: "shuffle" })
  async shuffle(interaction: CommandInteraction): Promise<void> {
    const cmd = await lavaPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    queue.shuffleTracks();
    await interaction.followUp({ content: "> playlist shuffled!" });
  }
}
