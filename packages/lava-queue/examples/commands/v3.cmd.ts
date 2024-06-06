/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { LoadType, PlayerStatus } from "@discordx/lava-player";
import { Player } from "@discordx/lava-queue";
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
import { ButtonComponent, Discord, Once, Slash, SlashOption } from "discordx";

import { getNode } from "./node.js";
import { MusicQueue } from "./queue.js";

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), ms);
  });
}

@Discord()
export class MusicPlayer {
  player: Record<string, Player> = {};

  // utils

  GetQueue(botId: string, guildId: string): MusicQueue | null {
    const player = this.player[botId];
    if (!player) {
      return null;
    }

    const queue = new MusicQueue(player, guildId);
    return player.queue(guildId, () => queue);
  }

  async ParseCommand(
    client: Client,
    interaction: CommandInteraction | ButtonInteraction,
    skipBotChannel = false,
  ): Promise<
    | {
        channel: TextBasedChannel;
        guild: Guild;
        member: GuildMember;
        queue: MusicQueue;
      }
    | undefined
  > {
    await interaction.deferReply();

    if (
      !interaction.channel ||
      !(interaction.member instanceof GuildMember) ||
      !interaction.guild ||
      !interaction.client.user
    ) {
      await interaction.followUp(
        "The command could not be processed. Please try again",
      );
      return;
    }

    if (!interaction.member.voice.channelId) {
      await interaction.followUp("Join a voice channel first");
      return;
    }

    const bot = interaction.guild?.members.cache.get(
      interaction.client.user?.id,
    );

    if (!bot) {
      await interaction.followUp(
        "Having difficulty finding my place in this world",
      );
      return;
    }

    if (
      !skipBotChannel &&
      interaction.member.voice.channelId !== bot.voice.channelId
    ) {
      await interaction.followUp("join to my voice channel");
      return;
    }

    const queue = this.GetQueue(client.botId, interaction.guild.id);

    if (!queue) {
      await interaction.followUp("The player is not ready yet, please wait");
      return;
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
    await wait(5e3);
    this.player[client.botId] = new Player(getNode(client));
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
    client: Client,
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction, true);
    if (!cmd) {
      return;
    }

    const { queue, member, channel } = cmd;

    await queue.lavaPlayer.join({
      channel: member.voice.channelId,
    });

    queue.channel = channel;
    const { loadType, data } = await queue.search(`ytsearch:${input}`);

    if (loadType !== LoadType.SEARCH || !data[0]) {
      await interaction.followUp("> no search result");
      return;
    }

    const track = data[0];
    queue.tracks.push(track);
    if (
      queue.lavaPlayer.status === PlayerStatus.INSTANTIATED ||
      queue.lavaPlayer.status === PlayerStatus.UNKNOWN ||
      queue.lavaPlayer.status === PlayerStatus.ENDED
    ) {
      await queue.playNext();
    }

    const embed = new EmbedBuilder();
    embed.setTitle("Enqueued");
    embed.setDescription(`Enqueued ${track.info.title} track`);

    await interaction.followUp({ embeds: [embed] });
    return;
  }

  @Slash({ description: "seek" })
  async seek(
    @SlashOption({
      description: "seconds",
      name: "seconds",
      required: true,
      type: ApplicationCommandOptionType.Number,
    })
    seconds: number,
    interaction: CommandInteraction,
    client: Client,
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    if (!queue.currentTrack) {
      await interaction.followUp("> I am not sure, I am playing anything");
      return;
    }

    if (seconds * 1000 > queue.currentTrack.info.length) {
      await queue.playNext();
      await interaction.followUp("> skipped the track instead");
      return;
    }

    await queue.lavaPlayer.update({
      position: seconds * 1000,
    });

    await interaction.followUp("> current track seeked");
    return;
  }

  // buttons

  @ButtonComponent({ id: "btn-next" })
  async nextControl(
    interaction: ButtonInteraction,
    client: Client,
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    const next = await queue.playNext();
    if (!next) {
      await queue.stop();
      await queue.lavaPlayer.leave();
    }

    // update controls
    await queue.updateControlMessage();

    // delete interaction
    await interaction.deleteReply();
  }

  @ButtonComponent({ id: "btn-pause" })
  async pauseControl(
    interaction: ButtonInteraction,
    client: Client,
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    queue.isPlaying ? await queue.pause() : await queue.resume();
    await queue.updateControlMessage();

    // delete interaction
    await interaction.deleteReply();
  }

  @ButtonComponent({ id: "btn-leave" })
  async leaveControl(
    interaction: ButtonInteraction,
    client: Client,
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    await queue.stop();
    await queue.lavaPlayer.leave();
    await queue.updateControlMessage();

    // delete interaction
    await interaction.deleteReply();
  }

  @ButtonComponent({ id: "btn-repeat" })
  async repeatControl(
    interaction: ButtonInteraction,
    client: Client,
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    queue.setRepeat(!queue.repeat);
    await queue.updateControlMessage();

    // delete interaction
    await interaction.deleteReply();
  }

  @ButtonComponent({ id: "btn-loop" })
  async loopControl(
    interaction: ButtonInteraction,
    client: Client,
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    queue.setLoop(!queue.loop);
    await queue.updateControlMessage();

    // delete interaction
    await interaction.deleteReply();
  }

  @ButtonComponent({ id: "btn-queue" })
  async queueControl(
    interaction: ButtonInteraction,
    client: Client,
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    await queue.view(interaction as unknown as CommandInteraction);
  }

  @ButtonComponent({ id: "btn-mix" })
  async mixControl(
    interaction: ButtonInteraction,
    client: Client,
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    queue.shuffle();
    await queue.updateControlMessage();

    // delete interaction
    await interaction.deleteReply();
  }

  @ButtonComponent({ id: "btn-controls" })
  async controlsControl(
    interaction: ButtonInteraction,
    client: Client,
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    await queue.updateControlMessage({ force: true });

    // delete interaction
    await interaction.deleteReply();
  }
}
