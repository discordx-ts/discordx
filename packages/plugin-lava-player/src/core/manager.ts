import type { QueueManager } from "@discordx/lava-queue";
import type {
  ButtonInteraction,
  CommandInteraction,
  Guild,
  TextBasedChannel,
} from "discord.js";
import { GuildMember } from "discord.js";

import { MusicQueue } from "./queue.js";

interface ParsedCommand {
  autoDeleteTimer: NodeJS.Timeout;
  channel: TextBasedChannel;
  guild: Guild;
  member: GuildMember;
  queue: MusicQueue;
}

class LavaPlayerManager {
  instance: QueueManager | null = null;
  INTERACTION_DELETE_DELAY = 60_000;

  delete(interaction: CommandInteraction | ButtonInteraction): NodeJS.Timeout {
    return setTimeout(() => {
      void interaction.deleteReply();
    }, this.INTERACTION_DELETE_DELAY);
  }

  getQueue(guildId: string): MusicQueue | null {
    if (!this.instance) {
      return null;
    }

    const queue = new MusicQueue(this.instance, guildId);
    return this.instance.queue(guildId, () => queue);
  }

  async parseCommand(
    interaction: CommandInteraction | ButtonInteraction,
  ): Promise<ParsedCommand | null> {
    await interaction.deferReply();
    const autoDeleteTimer = this.delete(interaction);

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
      autoDeleteTimer,
      channel: interaction.channel,
      guild: interaction.guild,
      member: interaction.member,
      queue,
    };
  }
}

export const lavaPlayerManager = new LavaPlayerManager();
