/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { PlayerStatus } from "@discordx/lava-player";
import type { Player } from "@discordx/lava-queue";
import { Queue } from "@discordx/lava-queue";
import {
  Pagination,
  PaginationResolver,
  PaginationType,
} from "@discordx/pagination";
import type {
  CommandInteraction,
  ContextMenuCommandInteraction,
  MessageActionRowComponentBuilder,
  TextBasedChannel,
} from "discord.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
} from "discord.js";

export class MusicQueue extends Queue {
  private _channel: TextBasedChannel | null = null;
  private _controlTimer: NodeJS.Timeout | null = null;

  private lastControlMessage?: Message;
  private lockUpdate = false;

  get isPlaying(): boolean {
    return this.lavaPlayer.status === PlayerStatus.PLAYING;
  }

  public setChannel(channel: TextBasedChannel): void {
    this._channel = channel;
  }

  constructor(player: Player, guildId: string) {
    super(player, guildId);
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
      .setStyle(this.repeat ? ButtonStyle.Danger : ButtonStyle.Primary)
      .setCustomId("btn-repeat");

    const loopButton = new ButtonBuilder()
      .setLabel("Loop")
      .setEmoji("🔁")
      .setDisabled(!this.isPlaying)
      .setStyle(this.loop ? ButtonStyle.Danger : ButtonStyle.Primary)
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

    embed.addFields({
      name:
        "Now Playing" +
        (this.size > 2 ? ` (Total: ${this.size} tracks queued)` : ""),
      value: `[${currentTrack.info.title}](${currentTrack.info.uri})`,
    });

    const progressBarOptions = {
      arrow: "🔘",
      block: "━",
      size: 15,
    };

    const { size, arrow, block } = progressBarOptions;
    const timeNow = this.position;
    const timeTotal = this.currentTrack?.info.length ?? 0;

    const progress = Math.round((size * timeNow) / timeTotal);
    const emptyProgress = size - progress;

    const progressString =
      block.repeat(progress) + arrow + block.repeat(emptyProgress);

    const bar = `${this.isPlaying ? "▶️" : "⏸️"} ${progressString}`;
    const currentTime = this.fromMS(timeNow);
    const endTime = this.fromMS(timeTotal);
    const spacing = bar.length - currentTime.length - endTime.length;
    const time = `\`${currentTime}${" ".repeat(spacing * 3 - 2)}${endTime}\``;

    embed.addFields({ name: bar, value: time });

    embed.addFields({
      name: "Next Song",
      value: nextTrack
        ? `[${nextTrack.info.title}](${nextTrack.info.uri})`
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
    interaction: CommandInteraction | ContextMenuCommandInteraction,
  ): Promise<void> {
    const queueErrorMessage =
      "> The queue could not be processed at the moment, please try again later!";
    const nowPlayingMessage = (title: string) => `> Playing **${title}**`;
    const pageTimeoutMessage = 60000; // 6e4
    const shortPaginationLimit = 5;
    const deleteDelayMsShort = 3000; // 3 seconds
    const deleteDelayMsLong = 10000; // 10 seconds

    const currentTrackMessage = (title: string, size: number, uri?: string) => {
      const trackTitle = uri ? `[${title}](<${uri}>)` : title;
      return `> Playing **${trackTitle}** out of ${size + 1}`;
    };

    if (!this.currentTrack) {
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
      const pMsg = await interaction.followUp(
        nowPlayingMessage(this.currentTrack.info.title),
      );
      if (pMsg instanceof Message) {
        setTimeout(() => void this.deleteMessage(pMsg), deleteDelayMsLong);
      }
      return;
    }

    const totalPages = Math.round(this.size / 10);
    const isShortPagination = totalPages <= shortPaginationLimit;

    const current = currentTrackMessage(
      this.currentTrack.info.title,
      this.size,
      this.currentTrack.info.uri,
    );

    const paginationType = isShortPagination
      ? PaginationType.Button
      : PaginationType.SelectMenu;

    const pageOptions = new PaginationResolver((index, paginator) => {
      paginator.maxLength = this.size / 10;
      if (index > paginator.maxLength) {
        paginator.currentPage = 0;
      }

      const currentPage = paginator.currentPage;

      const queue = this.tracks
        .slice(currentPage * 10, currentPage * 10 + 10)
        .map((track, _index) => {
          const index = currentPage * 10 + _index + 1;
          const trackLength = this.fromMS(track.info.length);
          const trackTitle = track.info.uri
            ? `[${track.info.title}](<${track.info.uri}>)`
            : track.info.title;

          return `${index}. ${trackTitle} (${trackLength})`;
        })
        .join("\n\n");

      return { content: `${current}\n\n${queue}` };
    }, totalPages);

    const pagination = new Pagination(interaction, pageOptions, {
      enableExit: true,
      onTimeout: (_, message) => {
        if (message.deletable) {
          void this.deleteMessage(message);
        }
      },
      time: pageTimeoutMessage,
      type: paginationType,
    });

    await pagination.send();
  }

  public async exit(): Promise<void> {
    this.stopControlUpdate();
    await this.lavaPlayer.destroy();
  }
}
