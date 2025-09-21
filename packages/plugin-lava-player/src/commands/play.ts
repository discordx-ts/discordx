/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import { LoadType } from "@discordx/lava-player";
import { fromMS } from "@discordx/lava-queue";
import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  type CommandInteraction,
} from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

import { lavaPlayerManager } from "../core/manager.js";

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
    const cmd = await lavaPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    clearTimeout(cmd.autoDeleteTimer);
    const { queue } = cmd;

    const isLink = input.startsWith("http://") || input.startsWith("https://");
    const searchText = isLink ? input : `ytmsearch:${input}`;
    const { loadType, data } = await queue.search(searchText);

    if (loadType === LoadType.ERROR) {
      await interaction.followUp({
        content: `Something went wrong: ${data.cause}`,
      });
      return;
    }

    if (loadType === LoadType.EMPTY) {
      await interaction.followUp({
        content: "There has been no matches for your identifier",
      });
      return;
    }

    if (loadType === LoadType.TRACK || loadType === LoadType.SEARCH) {
      const track = loadType === LoadType.SEARCH ? data[0] : data;
      if (!track) {
        await interaction.followUp({
          content: "There has been no matches for your search",
        });
        return;
      }

      queue.addTrack(track);

      const description = `Enqueued ${track.info.title} (${fromMS(track.info.length)}) track`;
      const embed = new EmbedBuilder();
      embed.setTitle("Enqueued");
      embed.setDescription(description);

      if (track.info.artworkUrl) {
        embed.setThumbnail(track.info.artworkUrl);
      }

      await interaction.followUp({ embeds: [embed] });
    } else {
      queue.addTrack(...data.tracks);

      const embed = new EmbedBuilder();
      embed.setTitle("Enqueued");
      embed.setDescription(
        `Enqueued ${data.info.name} playlist (${String(data.tracks.length)} tracks)`,
      );

      await interaction.followUp({ embeds: [embed] });
    }

    if (!queue.isPlaying) {
      await queue.playNext();
    }
  }
}
