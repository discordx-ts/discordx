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
  @Slash({ description: "Pause current track", name: "pause" })
  async pause(interaction: CommandInteraction): Promise<void> {
    const cmd = await lavaPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    const currentTrack = queue.currentPlaybackTrack;
    if (!currentTrack || !queue.isPlaying) {
      await interaction.followUp({
        content: "> I am already quite, amigo!",
      });
      return;
    }

    await queue.pause();
    await interaction.followUp(`> paused ${currentTrack.info.title}`);
  }

  @Slash({ description: "Resume current track", name: "resume" })
  async resume(interaction: CommandInteraction): Promise<void> {
    const cmd = await lavaPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    const currentTrack = queue.currentPlaybackTrack;
    if (!currentTrack || queue.isPlaying) {
      await interaction.followUp({
        content: "> I am already playing, amigo!",
      });
      return;
    }

    await queue.resume();
    await interaction.followUp(`> resuming ${currentTrack.info.title}`);
  }
}
