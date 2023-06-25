import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType, GuildMember } from "discord.js";

import { Discord, Slash, SlashOption } from "../../../discordx/src/index.js";
import { QueueNode, TrackQueue } from "../../src/index.js";
import { Main } from "../main.js";

@Discord()
export class music {
  queueNode: QueueNode;
  guildQueue = new Map<string, TrackQueue>();

  getQueue(guildId: string): TrackQueue {
    let queue = this.guildQueue.get(guildId);
    if (!queue) {
      queue = new TrackQueue({
        client: Main.Client,
        guildId: guildId,
        queueNode: this.queueNode,
      });

      this.guildQueue.set(guildId, queue);
    }

    return queue;
  }

  constructor() {
    this.queueNode = new QueueNode(Main.Client);
  }

  @Slash({ description: "Play a song", name: "play" })
  async play(interaction: CommandInteraction): Promise<void> {
    if (!interaction.guild) {
      return;
    }

    if (
      !(interaction.member instanceof GuildMember) ||
      !interaction.member.voice.channel
    ) {
      interaction.reply("You are not in the voice channel");
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const queue = this.getQueue(interaction.member.voice.channel.guildId);

    queue.join({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.member.voice.channel.guildId,
    });

    queue.addTrack({
      url: "https://www.youtube.com/watch?v=hp_-RlwNg04",
    });

    interaction.followUp("The requested song is being played");
  }

  @Slash({ description: "Set volume", name: "set-volume" })
  async setVolume(
    @SlashOption({
      description: "Set volume",
      name: "volume",
      required: true,
      type: ApplicationCommandOptionType.Number,
    })
    volume: number,
    interaction: CommandInteraction
  ): Promise<void> {
    if (!interaction.guild) {
      return;
    }

    if (
      !(interaction.member instanceof GuildMember) ||
      !interaction.member.voice.channel
    ) {
      interaction.reply("You are not in the voice channel");
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const queue = this.getQueue(interaction.member.voice.channel.guildId);

    queue.setVolume(volume);

    interaction.followUp("volume set");
  }

  @Slash({ description: "disconnect", name: "disconnect" })
  async disconnect(interaction: CommandInteraction): Promise<void> {
    if (!interaction.guild) {
      return;
    }

    if (
      !(interaction.member instanceof GuildMember) ||
      !interaction.member.voice.channel
    ) {
      interaction.reply("You are not in the voice channel");
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const queue = this.getQueue(interaction.member.voice.channel.guildId);
    queue.leave();
    this.guildQueue.delete(interaction.member.voice.channel.guildId);

    interaction.followUp("disconnected");
  }
}
