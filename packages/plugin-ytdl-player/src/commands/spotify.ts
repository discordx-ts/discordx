/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import spotifyUrlInfo from "spotify-url-info";
import { YouTube } from "youtube-sr";

import { musicPlayerManager } from "../core/manager.js";

const spotify = spotifyUrlInfo(fetch);

@Discord()
@SlashGroup("music")
export class Command {
  @Slash({ description: "Play a spotify link", name: "spotify" })
  async spotify(
    @SlashOption({
      description: "Spotify url",
      name: "url",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    url: string,
    @SlashOption({
      description: "Start song from specific time",
      name: "seek",
      required: false,
      type: ApplicationCommandOptionType.Number,
    })
    seek: number | undefined,
    interaction: CommandInteraction,
  ): Promise<void> {
    const cmd = await musicPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    clearTimeout(cmd.autoDeleteTimer);
    const { queue, member } = cmd;

    const result = await spotify.getTracks(url).catch(() => null);
    if (result === null) {
      await interaction.followUp(
        "The Spotify url you provided appears to be invalid, make sure that you have provided a valid url for Spotify",
      );
      return;
    }

    const videos = await Promise.all(
      result.map((track) =>
        YouTube.searchOne(`${track.name} by ${track.artist}`),
      ),
    );

    const tracks = videos.map((video) => ({
      duration: video.duration,
      seek,
      thumbnail: video.thumbnail?.url,
      title: video.title ?? "NaN",
      url: video.url,
      user: member.user,
    }));

    queue.addTrack(...tracks);

    const embed = new EmbedBuilder();
    embed.setTitle("Enqueued");
    embed.setDescription(
      `Enqueued  **${String(tracks.length)}** songs from spotify playlist`,
    );

    await interaction.followUp({ embeds: [embed] });

    if (!queue.currentPlaybackTrack) {
      queue.playNext();
    }
  }
}
