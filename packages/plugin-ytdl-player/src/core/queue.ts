/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { Track } from "@discordx/music";
import { Queue, RepeatMode } from "@discordx/music";
import type {
  Message,
  MessageActionRowComponentBuilder,
  TextBasedChannel,
  User,
} from "discord.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

import { deleteMessage, fromMS } from "../utils/index.js";

export interface MyTrack extends Track {
  duration: number;
  thumbnail?: string;
  title: string;
  user: User;
}

export class MusicQueue extends Queue<MyTrack> {
  private _channel: TextBasedChannel | null = null;
  private _controlTimer: NodeJS.Timeout | null = null;

  private lastControlMessage?: Message;
  private lockUpdate = false;

  public setChannel(channel: TextBasedChannel): void {
    this._channel = channel;
  }

  private controlsRow(): ActionRowBuilder<MessageActionRowComponentBuilder>[] {
    const nextButton = new ButtonBuilder()
      .setLabel("Next")
      .setEmoji("⏭")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(!this.isPlaying)
      .setCustomId("btn-next");

    const pauseButton = new ButtonBuilder()
      .setLabel(this.isPlaying ? "Pause" : "Resume")
      .setEmoji(this.isPlaying ? "⏸️" : "▶️")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("btn-pause");

    const stopButton = new ButtonBuilder()
      .setLabel("Stop")
      .setStyle(ButtonStyle.Danger)
      .setCustomId("btn-leave");

    const repeatButton = new ButtonBuilder()
      .setLabel("Repeat")
      .setEmoji("🔂")
      .setDisabled(!this.isPlaying)
      .setStyle(
        this.repeatMode === RepeatMode.REPEAT_ALL
          ? ButtonStyle.Danger
          : ButtonStyle.Primary,
      )
      .setCustomId("btn-repeat");

    const loopButton = new ButtonBuilder()
      .setLabel("Loop")
      .setEmoji("🔁")
      .setDisabled(!this.isPlaying)
      .setStyle(
        this.repeatMode === RepeatMode.REPEAT_ONE
          ? ButtonStyle.Danger
          : ButtonStyle.Primary,
      )
      .setCustomId("btn-loop");

    const row1 =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        stopButton,
        pauseButton,
        nextButton,
        repeatButton,
        loopButton,
      );

    const queueButton = new ButtonBuilder()
      .setLabel("Queue")
      .setEmoji("🎵")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("btn-queue");

    const mixButton = new ButtonBuilder()
      .setLabel("Shuffle")
      .setEmoji("🎛️")
      .setDisabled(!this.isPlaying)
      .setStyle(ButtonStyle.Primary)
      .setCustomId("btn-mix");

    const controlsButton = new ButtonBuilder()
      .setLabel("Controls")
      .setEmoji("🔄")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("btn-controls");

    const row2 =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        queueButton,
        mixButton,
        controlsButton,
      );

    return [row1, row2];
  }

  public async updateControlMessage(options?: {
    force?: boolean;
    text?: string;
  }): Promise<void> {
    if (this.lockUpdate || this._channel === null) {
      return;
    }

    this.lockUpdate = true;
    const embed = new EmbedBuilder();
    embed.setTitle("Music Controls");
    const currentTrack = this.currentPlaybackTrack;
    const nextTrack = this.nextTrack;

    if (!currentTrack) {
      if (this.lastControlMessage) {
        await deleteMessage(this.lastControlMessage);
        this.lastControlMessage = undefined;
      }
      this.lockUpdate = false;
      return;
    }

    const user = currentTrack.user;
    embed.addFields({
      name: `Now Playing${
        this.queueSize > 2
          ? `(Total: ${String(this.queueSize)} tracks queued)`
          : ""
      }`,
      value: `[${currentTrack.title}](${currentTrack.url}) by ${user.toString()}`,
    });

    const progressBarOptions = {
      arrow: "🔘",
      block: "━",
      size: 15,
    };

    const { size, arrow, block } = progressBarOptions;
    const timeNow = this.playbackInfo?.playbackDuration ?? 0;
    const timeTotal = currentTrack.duration;

    const progress = Math.round((size * timeNow) / timeTotal);
    const emptyProgress = size - progress;

    const progressString =
      block.repeat(progress) + arrow + block.repeat(emptyProgress);

    const bar = `${this.isPlaying ? "▶️" : "⏸️"} ${progressString}`;
    const currentTime = fromMS(timeNow);
    const endTime = fromMS(timeTotal);
    const spacing = bar.length - currentTime.length - endTime.length;
    const time = `\`${currentTime}${" ".repeat(spacing * 3 - 2)}${endTime}\``;
    embed.addFields({ name: bar, value: time });

    if (currentTrack.thumbnail) {
      embed.setThumbnail(currentTrack.thumbnail);
    }

    embed.addFields({
      name: "Next Song",
      value: nextTrack
        ? `[${nextTrack.title}](${nextTrack.url})`
        : "No upcoming song",
    });

    const pMsg = {
      components: [...this.controlsRow()],
      content: options?.text,
      embeds: [embed],
    };

    if (!options?.force && this.lastControlMessage) {
      // Update control message
      await this.lastControlMessage.edit(pMsg);
    } else {
      // Delete control message
      if (this.lastControlMessage) {
        await deleteMessage(this.lastControlMessage);
        this.lastControlMessage = undefined;
      }

      // Send control message
      this.lastControlMessage = await this._channel.send(pMsg);
    }

    this.lockUpdate = false;
  }

  public startControlUpdate(interval?: number): void {
    this.stopControlUpdate();

    this._controlTimer = setInterval(() => {
      void this.updateControlMessage();
    }, interval ?? 10_000);

    void this.updateControlMessage();
  }

  public stopControlUpdate(): void {
    if (this._controlTimer) {
      clearInterval(this._controlTimer);
      this._controlTimer = null;
    }

    if (this.lastControlMessage) {
      void deleteMessage(this.lastControlMessage);
      this.lastControlMessage = undefined;
    }

    this.lockUpdate = false;
  }

  public stop(): void {
    this.stopControlUpdate();
    this.exit();
  }
}
