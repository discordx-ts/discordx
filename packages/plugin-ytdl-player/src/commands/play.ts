/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { YouTube } from "youtube-sr";

import { fromMS, type MyTrack } from "../core/index.js";
import { musicPlayerManager } from "../core/manager.js";

@Discord()
@SlashGroup("music")
export class Command {
  @Slash({ description: "play" })
  async play(
    @SlashOption({
      description: "input",
      name: "input",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    input: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    const cmd = await musicPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    clearTimeout(cmd.autoDeleteTimer);
    const { queue, member } = cmd;

    const video = await YouTube.searchOne(input).catch(() => null);
    if (!video) {
      await interaction.followUp({
        content: "There has been no matches for your search",
      });
      return;
    }

    const track: MyTrack = {
      duration: video.duration,
      thumbnail: video.thumbnail?.url,
      title: video.title ?? "NaN",
      url: video.url,
      user: member.user,
    };

    queue.addTrack(track);

    const description = `Enqueued ${track.title} (${fromMS(track.duration)}) track`;
    const embed = new EmbedBuilder();
    embed.setTitle("Enqueued");
    embed.setDescription(description);

    if (track.thumbnail) {
      embed.setThumbnail(track.thumbnail);
    }

    await interaction.followUp({ embeds: [embed] });

    if (!queue.isPlaying) {
      queue.playNext();
    }
  }
}
