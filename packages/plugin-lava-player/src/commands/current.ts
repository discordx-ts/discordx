/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import { fromMS } from "@discordx/lava-queue";
import type { CommandInteraction } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";

import { lavaPlayerManager } from "../core/manager.js";

@Discord()
@SlashGroup("music")
export class Command {
  @Slash({
    description: "Show details of currently playing track",
    name: "current",
  })
  async current(interaction: CommandInteraction): Promise<void> {
    const cmd = await lavaPlayerManager.parseCommand(interaction);
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

    const { title, length } = currentTrack.info;
    const trackPosition = fromMS(queue.currentPlaybackPosition);
    const trackLength = fromMS(length);
    const description = `Playing **${title}** from **${trackPosition}/${trackLength}**`;

    const embed = new EmbedBuilder();
    embed.setTitle("Current Track");
    embed.setDescription(description);

    if (currentTrack.info.artworkUrl) {
      embed.setImage(currentTrack.info.artworkUrl);
    }

    await interaction.followUp({ embeds: [embed] });
  }
}
