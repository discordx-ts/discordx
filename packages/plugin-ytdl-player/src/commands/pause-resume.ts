/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import type { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";

import { musicPlayerManager } from "../core/manager.js";

@Discord()
@SlashGroup("music")
export class Command {
  @Slash({ description: "Pause current track", name: "pause" })
  async pause(interaction: CommandInteraction): Promise<void> {
    const cmd = await musicPlayerManager.parseCommand(interaction);
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

    queue.pause();
    await interaction.followUp(`> paused ${currentTrack.title}`);
  }

  @Slash({ description: "Resume current track", name: "resume" })
  async resume(interaction: CommandInteraction): Promise<void> {
    const cmd = await musicPlayerManager.parseCommand(interaction);
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

    queue.resume();
    await interaction.followUp(`> resuming ${currentTrack.title}`);
  }
}
