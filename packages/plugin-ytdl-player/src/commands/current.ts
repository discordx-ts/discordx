/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import type { CommandInteraction } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";

import { musicPlayerManager } from "../core/index.js";
import { fromMS } from "../utils/index.js";

@Discord()
@SlashGroup("music")
export class Command {
  @Slash({
    description: "Show details of currently playing track",
    name: "current",
  })
  async current(interaction: CommandInteraction): Promise<void> {
    const cmd = await musicPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    const currentTrack = queue.currentPlaybackTrack;

    if (!currentTrack) {
      await interaction.followUp({
        content: "> Not playing anything at the moment.",
      });
      return;
    }

    const currentPosition = fromMS(queue.playbackInfo?.playbackDuration ?? 0);
    const maxLength = fromMS(currentTrack.duration);

    const embed = new EmbedBuilder();
    embed.setTitle("Current Track");
    embed.setDescription(
      `Playing **${currentTrack.title}** from **${currentPosition}/${maxLength}**`,
    );

    if (currentTrack.thumbnail) {
      embed.setImage(currentTrack.thumbnail);
    }

    await interaction.followUp({ embeds: [embed] });
  }
}
