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
  @Slash({ description: "Skip current track", name: "skip" })
  async skip(interaction: CommandInteraction): Promise<void> {
    const cmd = await musicPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    const currentTrack = queue.currentPlaybackTrack;
    if (!currentTrack) {
      await interaction.followUp({
        content: "> There doesn't seem to be anything to skip at the moment.",
      });
      return;
    }

    const next = queue.playNext();
    if (!next) {
      queue.exit();
      await interaction.followUp({
        content: "> all queued up, amigo!",
      });
      return;
    }

    await interaction.followUp({
      content: `> Playing ${next.title}`,
    });
  }
}
