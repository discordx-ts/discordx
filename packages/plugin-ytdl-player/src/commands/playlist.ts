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

import type { MyTrack } from "../core/index.js";
import { musicPlayerManager } from "../core/manager.js";

@Discord()
@SlashGroup("music")
export class Command {
  @Slash({ description: "Play youtube playlist" })
  async playlist(
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

    const search = await YouTube.search(input, {
      limit: 1,
      type: "playlist",
    });

    const playlist = search[0];

    if (!playlist?.id) {
      await interaction.followUp("The playlist could not be found");
      return;
    }

    const playlistInfo = await YouTube.getPlaylist(playlist.id, {
      fetchAll: true,
    });

    const tracks: MyTrack[] = playlistInfo.videos.map((video) => ({
      duration: video.duration,
      thumbnail: video.thumbnail?.url,
      title: video.title ?? "NaN",
      url: video.url,
      user: member.user,
    }));

    queue.addTrack(...tracks);

    const embed = new EmbedBuilder();
    embed.setTitle("Enqueued");
    embed.setDescription(
      `Enqueued  **${String(tracks.length)}** songs from playlist **${playlistInfo.title ?? "NA"}**`,
    );

    if (playlist.thumbnail?.url) {
      embed.setThumbnail(playlist.thumbnail.url);
    }

    await interaction.followUp({ embeds: [embed] });

    if (!queue.isPlaying) {
      queue.playNext();
    }
  }
}
