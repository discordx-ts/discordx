/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import type { QueueManager } from "@discordx/lava-queue";
import {
  GuildMember,
  PartialGroupDMChannel,
  type ButtonInteraction,
  type CommandInteraction,
  type Guild,
  type TextBasedChannel,
} from "discord.js";

import { MusicQueue } from "./queue.js";

export interface ParsedCommand {
  autoDeleteTimer: NodeJS.Timeout;
  channel: TextBasedChannel;
  guild: Guild;
  member: GuildMember;
  queue: MusicQueue;
}

export class LavaPlayerManager {
  instance: QueueManager | null = null;
  COMMAND_INTERACTION_DELETE_DELAY = 60_000;
  BUTTON_INTERACTION_DELETE_DELAY = 3_000;

  delete(interaction: CommandInteraction | ButtonInteraction): NodeJS.Timeout {
    const isButton = interaction.isButton();
    const delay = isButton
      ? this.BUTTON_INTERACTION_DELETE_DELAY
      : this.COMMAND_INTERACTION_DELETE_DELAY;

    return setTimeout(() => {
      void interaction.deleteReply();
    }, delay);
  }

  getQueue(guildId: string): MusicQueue | null {
    if (!this.instance) {
      return null;
    }

    const { node } = this.instance;
    return this.instance.queue(guildId, () => new MusicQueue(node, guildId));
  }

  async parseCommand(
    interaction: CommandInteraction | ButtonInteraction,
  ): Promise<ParsedCommand | null> {
    await interaction.deferReply();
    const autoDeleteTimer = this.delete(interaction);

    if (
      !interaction.channel ||
      !(interaction.member instanceof GuildMember) ||
      !interaction.guild ||
      interaction.channel instanceof PartialGroupDMChannel
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
      autoDeleteTimer,
      channel: interaction.channel,
      guild: interaction.guild,
      member: interaction.member,
      queue,
    };
  }
}

export const lavaPlayerManager = new LavaPlayerManager();
