/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { Track } from "@discordx/music";
import { RepeatMode, TrackQueue } from "@discordx/music";
import {
  Pagination,
  PaginationResolver,
  PaginationType,
} from "@discordx/pagination";
import type {
  CommandInteraction,
  MessageActionRowComponentBuilder,
  TextBasedChannel,
  User,
} from "discord.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
} from "discord.js";

export interface MyTrack extends Track {
  duration: number;
  thumbnail?: string;
  title: string;
  user: User;
}

export function formatDurationFromMS(duration: number): string {
  const seconds = Math.floor((duration / 1e3) % 60);
  const minutes = Math.floor((duration / 6e4) % 60);
  const hours = Math.floor(duration / 36e5);
  const secondsPad = seconds.toString().padStart(2, "0");
  const minutesPad = minutes.toString().padStart(2, "0");
  const hoursPad = hours.toString().padStart(2, "0");
  return `${hours ? `${hoursPad}:` : ""}${minutesPad}:${secondsPad}`;
}

export function convertDurationToMS(duration: string): number {
  const milliseconds =
    duration
      .split(":")
      .reduceRight(
        (prev, curr, i, arr) =>
          prev + parseInt(curr) * Math.pow(60, arr.length - 1 - i),
        0,
      ) * 1e3;

  return milliseconds ? milliseconds : 0;
}

export class Queue extends TrackQueue<MyTrack> {
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
        this.repeatMode === RepeatMode.All
          ? ButtonStyle.Danger
          : ButtonStyle.Primary,
      )
      .setCustomId("btn-repeat");

    const loopButton = new ButtonBuilder()
      .setLabel("Loop")
      .setEmoji("🔁")
      .setDisabled(!this.isPlaying)
      .setStyle(
        this.repeatMode === RepeatMode.One
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

  private async deleteMessage(message: Message): Promise<void> {
    if (message.deletable) {
      // ignore any exceptions in delete action
      await message.delete().catch(() => null);
    }
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
    const currentTrack = this.currentTrack;
    const nextTrack = this.nextTrack;

    if (!currentTrack) {
      if (this.lastControlMessage) {
        await this.deleteMessage(this.lastControlMessage);
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
    const currentTime = formatDurationFromMS(timeNow);
    const endTime = formatDurationFromMS(timeTotal);
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
        await this.deleteMessage(this.lastControlMessage);
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
      void this.deleteMessage(this.lastControlMessage);
      this.lastControlMessage = undefined;
    }

    this.lockUpdate = false;
  }

  public async view(interaction: CommandInteraction): Promise<void> {
    const currentTrack = this.currentTrack;
    if (!currentTrack) {
      const pMsg = await interaction.followUp({
        content: "> could not process queue atm, try later!",
        ephemeral: true,
      });
      if (pMsg instanceof Message) {
        setTimeout(() => void this.deleteMessage(pMsg), 3000);
      }
      return;
    }

    if (!this.queueSize) {
      const pMsg = await interaction.followUp({
        content: `> Playing **${currentTrack.title}**`,
        embeds: currentTrack.thumbnail
          ? [{ image: { url: currentTrack.thumbnail } }]
          : [],
      });

      if (pMsg instanceof Message) {
        setTimeout(() => void this.deleteMessage(pMsg), 1e4);
      }
      return;
    }

    const current = `> Playing **${currentTrack.title}** out of ${String(
      this.queueSize + 1,
    )}`;

    const pageOptions = new PaginationResolver(
      (index, paginator) => {
        paginator.maxLength = this.queueSize / 10;
        if (index > paginator.maxLength) {
          paginator.currentPage = 0;
        }

        const currentPage = paginator.currentPage;

        const queue = this.tracks
          .slice(currentPage * 10, currentPage * 10 + 10)
          .map(
            (track, index1) =>
              `${String(currentPage * 10 + index1 + 1)}. ${track.title}` +
              ` (${formatDurationFromMS(track.duration)})`,
          )
          .join("\n\n");

        return { content: `${current}\n\`\`\`markdown\n${queue}\`\`\`` };
      },
      Math.floor(this.queueSize / 10),
    );

    await new Pagination(interaction, pageOptions, {
      enableExit: true,
      onTimeout: (index, message) => {
        void this.deleteMessage(message);
      },
      time: 6e4,
      type:
        Math.floor(this.queueSize / 10) <= 5
          ? PaginationType.Button
          : PaginationType.SelectMenu,
    }).send();
  }

  public exit(): void {
    this.stopControlUpdate();
    this.leave();
  }
}
