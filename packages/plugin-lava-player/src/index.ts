/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { setTimeout } from "node:timers/promises";

import { LoadType } from "@discordx/lava-player";
import { fromMS, QueueManager, RepeatMode } from "@discordx/lava-queue";
import type {
  ButtonInteraction,
  CommandInteraction,
  Guild,
  TextBasedChannel,
} from "discord.js";
import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import type { ArgsOf, Client } from "discordx";
import {
  ButtonComponent,
  Discord,
  Once,
  Slash,
  SlashGroup,
  SlashOption,
} from "discordx";

import { getNode } from "./node.js";
import { MusicQueue } from "./queue.js";

@Discord()
@SlashGroup({ description: "music", name: "music" })
@SlashGroup("music")
export class MusicPlayer {
  queueManager: QueueManager | null = null;
  INTERACTION_DELETE_DELAY = 60_000;

  // utils

  async delete(
    interaction: CommandInteraction | ButtonInteraction,
  ): Promise<void> {
    await setTimeout(this.INTERACTION_DELETE_DELAY);
    await interaction.deleteReply();
  }

  getQueue(guildId: string): MusicQueue | null {
    if (!this.queueManager) {
      return null;
    }

    const queue = new MusicQueue(this.queueManager, guildId);
    return this.queueManager.queue(guildId, () => queue);
  }

  async parseCommand(
    interaction: CommandInteraction | ButtonInteraction,
    autoDelete = true,
  ): Promise<{
    channel: TextBasedChannel;
    guild: Guild;
    member: GuildMember;
    queue: MusicQueue;
  } | null> {
    await interaction.deferReply();
    if (autoDelete) {
      void this.delete(interaction);
    }

    if (
      !interaction.channel ||
      !(interaction.member instanceof GuildMember) ||
      !interaction.guild
    ) {
      await interaction.followUp({
        content: "The command could not be processed. Please try again",
      });
      return null;
    }

    if (!interaction.member.voice.channelId) {
      await interaction.followUp({
        content: "Join a voice channel first",
      });
      return null;
    }

    const bot = interaction.guild.members.cache.get(interaction.client.user.id);

    if (!bot) {
      await interaction.followUp({
        content: "Having difficulty finding my place in this world",
      });
      return null;
    }

    const queue = this.getQueue(interaction.guild.id);

    if (!queue) {
      await interaction.followUp({
        content: "The player is not ready yet, please wait",
      });
      return null;
    }

    if (bot.voice.channelId === null) {
      queue.setChannel(interaction.channel);
      await queue.guildPlayer.join({
        channel: interaction.member.voice.channelId,
      });
    } else if (interaction.member.voice.channelId !== bot.voice.channelId) {
      await interaction.followUp({
        content: "join to my voice channel",
      });
      return null;
    }

    return {
      channel: interaction.channel,
      guild: interaction.guild,
      member: interaction.member,
      queue,
    };
  }

  // events

  @Once()
  async ready(_: ArgsOf<"ready">, client: Client): Promise<void> {
    await setTimeout(5e3);
    this.queueManager = new QueueManager(getNode(client));
  }

  // buttons

  @ButtonComponent({ id: "btn-next" })
  async nextControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = await this.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    const next = await queue.playNext();
    if (!next) {
      await queue.exit();
      await interaction.followUp({
        content: "> all queued up, amigo!",
      });
      return;
    }

    await interaction.followUp({
      content: `> Playing ${next.info.title}`,
    });
  }

  @ButtonComponent({ id: "btn-pause" })
  async pauseControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = await this.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    if (queue.isPlaying) {
      await queue.pause();
    } else {
      await queue.resume();
    }
  }

  @ButtonComponent({ id: "btn-leave" })
  async leaveControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = await this.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    await queue.exit();
  }

  @ButtonComponent({ id: "btn-repeat" })
  async repeatControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = await this.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    const isRepeat = queue.repeatMode === RepeatMode.REPEAT_ONE;
    queue.setRepeatMode(isRepeat ? RepeatMode.OFF : RepeatMode.REPEAT_ONE);
  }

  @ButtonComponent({ id: "btn-loop" })
  async loopControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = await this.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    const isRepeatAll = queue.repeatMode === RepeatMode.REPEAT_ALL;
    queue.setRepeatMode(isRepeatAll ? RepeatMode.OFF : RepeatMode.REPEAT_ALL);
  }

  @ButtonComponent({ id: "btn-queue" })
  async queueControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = await this.parseCommand(interaction, false);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    await queue.view(interaction);
  }

  @ButtonComponent({ id: "btn-mix" })
  async mixControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = await this.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    queue.shuffleTracks();
  }

  @ButtonComponent({ id: "btn-controls" })
  async controlsControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = await this.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    await queue.updateControlMessage({ force: true });
  }

  // slashes

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
    const cmd = await this.parseCommand(interaction, false);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    const isLink = input.startsWith("http://") || input.startsWith("https://");
    const searchText = isLink ? input : `ytsearch:${input}`;
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

      const embed = new EmbedBuilder();
      embed.setTitle("Enqueued");
      embed.setDescription(`Enqueued ${track.info.title} track`);

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

  @Slash({
    description: "Show details of currently playing track",
    name: "current",
  })
  async current(interaction: CommandInteraction): Promise<void> {
    const cmd = await this.parseCommand(interaction);
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

  @Slash({ description: "Play current track on specific time", name: "seek" })
  async seek(
    @SlashOption({
      description: "time in seconds",
      name: "seconds",
      required: true,
      type: ApplicationCommandOptionType.Integer,
    })
    seconds: number,
    interaction: CommandInteraction,
  ): Promise<void> {
    const cmd = await this.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    if (!queue.currentPlaybackTrack) {
      await interaction.followUp({
        content: "> I am not sure, I am playing anything",
      });
      return;
    }

    const maxSeconds = Math.ceil(queue.currentPlaybackTrack.info.length / 1000);
    if (seconds > maxSeconds) {
      await interaction.followUp({
        content: `Track ${queue.currentPlaybackTrack.info.title} max length in seconds is ${String(maxSeconds)}`,
      });
      return;
    }

    await queue.guildPlayer.update({
      position: seconds * 1000,
    });

    await interaction.followUp(
      `> Playing ${queue.currentPlaybackTrack.info.title} at ${fromMS(seconds * 1000)}`,
    );
  }

  @Slash({ description: "View queue", name: "queue" })
  async queue(interaction: CommandInteraction): Promise<void> {
    const cmd = await this.parseCommand(interaction, false);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    await queue.view(interaction);
  }

  @Slash({ description: "Pause current track", name: "pause" })
  async pause(interaction: CommandInteraction): Promise<void> {
    const cmd = await this.parseCommand(interaction);
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
    const cmd = await this.parseCommand(interaction);
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

  @Slash({ description: "Skip current track", name: "skip" })
  async skip(interaction: CommandInteraction): Promise<void> {
    const cmd = await this.parseCommand(interaction);
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

    const next = await queue.playNext();
    if (!next) {
      await queue.exit();
      await interaction.followUp({
        content: "> all queued up, amigo!",
      });
      return;
    }

    await interaction.followUp({
      content: `> Playing ${next.info.title}`,
    });
  }

  @Slash({
    description:
      "The player volume, in percentage, from 0 to 1000 (default 100)",
    name: "set-volume",
  })
  async setVolume(
    @SlashOption({
      description: "Set volume",
      maxValue: 1000,
      minValue: 0,
      name: "volume",
      required: true,
      type: ApplicationCommandOptionType.Integer,
    })
    volume: number,
    interaction: CommandInteraction,
  ): Promise<void> {
    const cmd = await this.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    await queue.setVolume(volume);
    await interaction.followUp({
      content: `> volume set to ${String(volume)}`,
    });
  }

  @Slash({ description: "Stop music player", name: "stop" })
  async stop(interaction: CommandInteraction): Promise<void> {
    const cmd = await this.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    await queue.exit();
    await interaction.followUp({
      content: "> adios amigo, see you later!",
    });
  }

  @Slash({ description: "Shuffle queue", name: "shuffle" })
  async shuffle(interaction: CommandInteraction): Promise<void> {
    const cmd = await this.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    queue.shuffleTracks();
    await interaction.followUp({ content: "> playlist shuffled!" });
  }

  @Slash({ description: "Show GUI controls", name: "gui-show" })
  async guiShow(interaction: CommandInteraction): Promise<void> {
    const cmd = await this.parseCommand(interaction);
    if (!cmd || !interaction.channel) {
      return;
    }

    const { queue } = cmd;
    queue.setChannel(interaction.channel);
    queue.startControlUpdate();
    await interaction.followUp({ content: "> Enable GUI mode!" });
  }

  @Slash({ description: "Hide GUI controls", name: "gui-hide" })
  async guiHide(interaction: CommandInteraction): Promise<void> {
    const cmd = await this.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    queue.stopControlUpdate();
    await interaction.followUp({ content: "> Disabled GUI mode!" });
  }
}
