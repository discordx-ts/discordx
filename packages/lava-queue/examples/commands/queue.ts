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
  lastControlMessage?: Message;
  timeoutTimer?: NodeJS.Timeout;
  lockUpdate = false;
  channel?: TextBasedChannel;

  get isPlaying(): boolean {
    return this.lavaPlayer.status === PlayerStatus.PLAYING;
  }

  constructor(player: Player, guildId: string) {
    super(player, guildId);
    setInterval(() => void this.updateControlMessage(), 1e4);
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

  public async updateControlMessage(options?: {
    force?: boolean;
    text?: string;
  }): Promise<void> {
    if (this.lockUpdate) {
      return;
    }

    this.lockUpdate = true;
    const embed = new EmbedBuilder();
    embed.setTitle("Music Controls");
    const currentTrack = this.currentTrack;
    const nextTrack = this.nextTrack;

    if (!currentTrack) {
      if (this.lastControlMessage) {
        await this.lastControlMessage.delete().catch(() => null);
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

    if (!this.lastControlMessage || options?.force) {
      if (this.lastControlMessage) {
        await this.lastControlMessage.delete().catch(() => null);
        this.lastControlMessage = undefined;
      }

      const msg = await this.channel?.send(pMsg).catch(() => null);
      if (msg) {
        this.lastControlMessage = msg;
      }
    } else {
      await this.lastControlMessage.edit(pMsg).catch(() => null);
    }

    this.lockUpdate = false;
  }

  public async view(
    interaction: CommandInteraction | ContextMenuCommandInteraction,
  ): Promise<void> {
    if (!this.currentTrack) {
      const pMsg = await interaction.followUp({
        content:
          "> The queue could not be processed at the moment, please try again later!",
        ephemeral: true,
      });

      if (pMsg instanceof Message) {
        setTimeout(() => void pMsg.delete().catch(() => null), 3000);
      }
      return;
    }

    if (!this.size) {
      const pMsg = await interaction.followUp(
        `> Playing **${this.currentTrack.info.title}**`,
      );
      if (pMsg instanceof Message) {
        setTimeout(() => void pMsg.delete().catch(() => null), 1e4);
      }
      return;
    }

    const current = `> Playing **[${this.currentTrack.info.title}](<${
      this.currentTrack.info.uri
    }>)** out of ${this.size + 1}`;

    const pageOptions = new PaginationResolver(
      (index, paginator) => {
        paginator.maxLength = this.size / 10;
        if (index > paginator.maxLength) {
          paginator.currentPage = 0;
        }

        const currentPage = paginator.currentPage;

        const queue = this.tracks
          .slice(currentPage * 10, currentPage * 10 + 10)
          .map(
            (track, index1) =>
              `${currentPage * 10 + index1 + 1}. [${track.info.title}](<${
                track.info.uri
              }>) (${this.fromMS(track.info.length)})`,
          )
          .join("\n\n");

        return { content: `${current}\n\n${queue}` };
      },
      Math.round(this.size / 10),
    );

    await new Pagination(interaction, pageOptions, {
      enableExit: true,
      onTimeout: (index, message) => {
        if (message.deletable) {
          message.delete().catch(() => null);
        }
      },
      time: 6e4,
      type:
        Math.round(this.size / 10) <= 5
          ? PaginationType.Button
          : PaginationType.SelectMenu,
    })
      .send()
      .catch(() => null);
  }
}
