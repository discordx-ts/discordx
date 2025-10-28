/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { fromMS, Queue, RepeatMode } from "@discordx/lava-queue";
import { Pagination, PaginationResolver } from "@discordx/pagination";
import {
  ActionRowBuilder,
  ButtonBuilder,
  type ButtonInteraction,
  ButtonStyle,
  type CommandInteraction,
  EmbedBuilder,
  Message,
  type MessageActionRowComponentBuilder,
  type PartialGroupDMChannel,
  type TextBasedChannel,
} from "discord.js";

export type TrackChannel = Exclude<TextBasedChannel, PartialGroupDMChannel>;

export class MusicQueue extends Queue {
  private _channel: TrackChannel | null = null;
  private _controlTimer: NodeJS.Timeout | null = null;

  private lastControlMessage?: Message;
  private lockUpdate = false;

  public setChannel(channel: TrackChannel): void {
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
        this.repeatMode === RepeatMode.REPEAT_ONE
          ? ButtonStyle.Danger
          : ButtonStyle.Primary,
      )
      .setCustomId("btn-repeat");

    const loopButton = new ButtonBuilder()
      .setLabel("Loop")
      .setEmoji("🔁")
      .setDisabled(!this.isPlaying)
      .setStyle(
        this.repeatMode === RepeatMode.REPEAT_ALL
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
        loopButton,
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
    const currentPlaybackTrack = this.currentPlaybackTrack;
    const nextTrack = this.nextTrack;

    if (!currentPlaybackTrack) {
      if (this.lastControlMessage) {
        await this.deleteMessage(this.lastControlMessage);
        this.lastControlMessage = undefined;
      }

      this.lockUpdate = false;
      return;
    }

    const { title, uri, length: trackTimeTotal } = currentPlaybackTrack.info;
    const uriText = uri ? `[${title}](${uri})` : title;

    const subText =
      this.size > 2 ? ` (Total: ${String(this.size)} tracks queued)` : "";

    embed.addFields({
      name: `Now Playing${subText}`,
      value: uriText,
    });

    const progressBarOptions = {
      arrow: "🔘",
      block: "━",
      size: 15,
    };

    const { size, arrow, block } = progressBarOptions;
    const timeNow = this.currentPlaybackPosition;

    const progress = Math.round((size * timeNow) / trackTimeTotal);
    const emptyProgress = size - progress;

    const progressString =
      block.repeat(progress) + arrow + block.repeat(emptyProgress);

    const bar = `${this.isPlaying ? "▶️" : "⏸️"} ${progressString}`;
    const currentTime = fromMS(timeNow);
    const endTime = fromMS(trackTimeTotal);
    const spacing = bar.length - currentTime.length - endTime.length;
    const time = `\`${currentTime}${" ".repeat(spacing * 3 - 2)}${endTime}\``;

    embed.addFields({ name: bar, value: time });

    let nextTrackText = "No upcoming song";
    if (nextTrack) {
      if (nextTrack.info.uri) {
        nextTrackText = `[${nextTrack.info.title}](${nextTrack.info.uri})`;
      } else {
        nextTrackText = nextTrack.info.title;
      }
    }

    embed.addFields({
      name: "Next Song",
      value: nextTrackText,
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
    if (this._controlTimer !== null) {
      clearInterval(this._controlTimer);
      this._controlTimer = null;
    }

    if (this.lastControlMessage) {
      void this.deleteMessage(this.lastControlMessage);
      this.lastControlMessage = undefined;
    }

    this.lockUpdate = false;
  }

  public async view(
    interaction: ButtonInteraction | CommandInteraction,
  ): Promise<void> {
    const queueErrorMessage =
      "> The queue could not be processed at the moment, please try again later!";
    const nowPlayingMessage = (title: string) => `> Playing **${title}**`;
    const pageTimeoutMessage = 60_000; // 6e4
    const deleteDelayMsShort = 3_000; // 3 seconds
    const deleteDelayMsLong = 10_000; // 10 seconds

    const currentPlaybackTrackMessage = (
      title: string,
      size: number,
      uri?: string,
    ) => {
      const trackTitle = uri ? `[${title}](<${uri}>)` : title;
      return `> Playing **${trackTitle}** out of ${String(size + 1)}`;
    };

    if (!this.currentPlaybackTrack) {
      const pMsg = await interaction.followUp({
        content: queueErrorMessage,
        ephemeral: true,
      });

      if (pMsg instanceof Message) {
        setTimeout(() => void this.deleteMessage(pMsg), deleteDelayMsShort);
      }
      return;
    }

    if (this.size === 0) {
      const pMsg = await interaction.followUp({
        content: nowPlayingMessage(this.currentPlaybackTrack.info.title),
        ephemeral: true,
      });
      if (pMsg instanceof Message) {
        setTimeout(() => void this.deleteMessage(pMsg), deleteDelayMsLong);
      }
      return;
    }

    const totalPages = Math.round(this.size / 10);

    const current = currentPlaybackTrackMessage(
      this.currentPlaybackTrack.info.title,
      this.size,
      this.currentPlaybackTrack.info.uri,
    );

    const pageOptions = new PaginationResolver((_index, paginator) => {
      paginator.setMaxLength(this.size / 10);

      const { currentPage } = paginator;

      const queue = this.tracks
        .slice(currentPage * 10, currentPage * 10 + 10)
        .map((track, _index) => {
          const index = currentPage * 10 + _index + 1;
          const trackLength = fromMS(track.info.length);
          const trackTitle = track.info.uri
            ? `[${track.info.title}](<${track.info.uri}>)`
            : track.info.title;

          return `${String(index)}. ${trackTitle} (${trackLength})`;
        })
        .join("\n\n");

      return { content: `${current}\n\n${queue}` };
    }, totalPages);

    const pagination = new Pagination(interaction, pageOptions, {
      onTimeout: (_, message) => {
        if (message.deletable) {
          void this.deleteMessage(message);
        }
      },
      time: pageTimeoutMessage,
    });

    await pagination.send();
  }

  public async exit(): Promise<void> {
    this.stopControlUpdate();
    await super.exit();
  }
}
