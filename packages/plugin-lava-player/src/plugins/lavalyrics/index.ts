/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import { RequestType } from "@discordx/lava-player";
import type { Queue } from "@discordx/lava-queue";
import { type CommandInteraction, EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";

import { lavaPlayerManager } from "../../core/index.js";
import type { Lyrics } from "./types.js";

/**
 * Get the lyrics for the currently playing track.
 *
 * Requires [LavaLyrics](https://github.com/topi314/LavaLyrics) plugin and a supported
 * [lyrics source](https://github.com/topi314/LavaLyrics?tab=readme-ov-file#supported-sources) plugin.
 */
export function getCurrentPlaybackLyrics(
  queue: Queue,
  skipTrackSource = true,
): Promise<Lyrics | null> {
  const uri = `sessions/${queue.sessionId}/players/${queue.guildId}/track/lyrics?skipTrackSource=${String(skipTrackSource)}`;
  const url = queue.http.url(uri);
  return queue.http.request(RequestType.GET, url);
}

/**
 * Get the lyrics for the track.
 *
 * Requires [LavaLyrics](https://github.com/topi314/LavaLyrics) plugin and a supported
 * [lyrics source](https://github.com/topi314/LavaLyrics?tab=readme-ov-file#supported-sources) plugin.
 */
export function getLyrics(
  queue: Queue,
  encodedTrack: string,
  skipTrackSource = true,
): Promise<Lyrics | null> {
  const uri = `lyrics?track=${encodeURIComponent(encodedTrack)}&skipTrackSource=${String(skipTrackSource)}`;
  const url = queue.http.url(uri);
  return queue.http.request(RequestType.GET, url);
}

@Discord()
@SlashGroup("music")
export class Command {
  @Slash({ description: "gets the lyrics for the current track" })
  async lyrics(interaction: CommandInteraction): Promise<void> {
    const cmd = await lavaPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    if (!queue.currentPlaybackTrack) {
      await interaction.followUp("> Nothing is playing");
      return;
    }

    if (!queue.currentPlaybackTrack.info.isSeekable) {
      await interaction.followUp("> There are no lyrics for a livestream");
      return;
    }

    const response = await getCurrentPlaybackLyrics(queue);

    if (!response) {
      await interaction.followUp("> Lyrics not found");
      return;
    }

    clearTimeout(cmd.autoDeleteTimer);

    const title = `${queue.currentPlaybackTrack.info.author} - ${queue.currentPlaybackTrack.info.title}`;
    const lyric = response.lines.map((line) => line.line).join("\n");
    const embed = new EmbedBuilder().setTitle(title).setDescription(lyric);

    if (queue.currentPlaybackTrack.info.uri) {
      embed.setURL(queue.currentPlaybackTrack.info.uri);
    }

    if (queue.currentPlaybackTrack.info.artworkUrl) {
      embed.setThumbnail(queue.currentPlaybackTrack.info.artworkUrl);
    }

    await interaction.followUp({ embeds: [embed] });
  }
}
