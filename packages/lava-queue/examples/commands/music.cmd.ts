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

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), ms);
  });
}

@Discord()
@SlashGroup({ description: "music", name: "music" })
@SlashGroup("music")
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
      await queue.exit();
    }

    // Delete interaction
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

    // Delete interaction
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
    await queue.exit();

    // Delete interaction
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

    // Delete interaction
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

    // Delete interaction
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

    // Delete interaction
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

    // Delete interaction
    await interaction.deleteReply();
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

    queue.setChannel(channel);
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

    if (track.info.artworkUrl) {
      embed.setThumbnail(track.info.artworkUrl);
    }

    await interaction.followUp({ embeds: [embed] });
    return;
  }

  @Slash({
    description: "Show details of currently playing song",
    name: "current",
  })
  async current(
    interaction: CommandInteraction,
    client: Client,
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    const currentTrack = queue.currentTrack;
    if (!currentTrack) {
      await interaction.followUp("> Not playing anything at the moment.");
      return;
    }

    const { title, length } = currentTrack.info;
    const trackPosition = queue.fromMS(queue.position);
    const trackLength = queue.fromMS(length);
    const description = `Playing **${title}** from **${trackPosition}/${trackLength}**`;

    const embed = new EmbedBuilder();
    embed.setTitle("Current Track");
    embed.setDescription(description);

    if (currentTrack.info.artworkUrl) {
      embed.setImage(currentTrack.info.artworkUrl);
    }

    await interaction.followUp({ embeds: [embed] });
  }

  @Slash({ description: "Play current song on specific time", name: "seek" })
  async seek(
    @SlashOption({
      description: "time in seconds",
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
  }

  @Slash({ description: "View queue", name: "queue" })
  async queue(interaction: CommandInteraction, client: Client): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    await queue.view(interaction);
  }

  @Slash({ description: "Pause current track", name: "pause" })
  async pause(interaction: CommandInteraction, client: Client): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    const currentTrack = queue.currentTrack;
    if (!currentTrack || !queue.isPlaying) {
      await interaction.followUp("> I am already quite, amigo!");
      return;
    }

    await queue.pause();
    await interaction.followUp(`> paused ${currentTrack.info.title}`);
  }

  @Slash({ description: "Resume current track", name: "resume" })
  async resume(interaction: CommandInteraction, client: Client): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    const currentTrack = queue.currentTrack;
    if (!currentTrack || queue.isPlaying) {
      await interaction.followUp(
        "> no no no, I am already doing my best, amigo!",
      );
      return;
    }

    await queue.resume();
    await interaction.followUp(`> resuming ${currentTrack.info.title}`);
  }

  @Slash({ description: "Skip current song", name: "skip" })
  async skip(interaction: CommandInteraction, client: Client): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    const currentTrack = queue.currentTrack;
    if (!currentTrack) {
      await interaction.followUp(
        "> There doesn't seem to be anything to skip at the moment.",
      );
      return;
    }

    await queue.playNext();
    await interaction.followUp(`> skipped ${currentTrack.info.title}`);
  }

  @Slash({ description: "Set volume", name: "set-volume" })
  async setVolume(
    @SlashOption({
      description: "Set volume",
      maxValue: 100,
      minValue: 0,
      name: "volume",
      required: true,
      type: ApplicationCommandOptionType.Number,
    })
    volume: number,
    interaction: CommandInteraction,
    client: Client,
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    await queue.setVolume(volume);
    await interaction.followUp(`> volume set to ${volume}`);
  }

  @Slash({ description: "Stop music player", name: "stop" })
  async stop(interaction: CommandInteraction, client: Client): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    await queue.exit();
    await interaction.followUp("> adios amigo, see you later!");
  }

  @Slash({ description: "Shuffle queue", name: "shuffle" })
  async shuffle(
    interaction: CommandInteraction,
    client: Client,
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    queue.shuffle();
    await interaction.followUp("> playlist shuffled!");
  }

  @Slash({ description: "Show GUI controls", name: "gui-show" })
  async guiShow(
    interaction: CommandInteraction,
    client: Client,
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd || !interaction.channel) {
      return;
    }

    const { queue } = cmd;
    queue.setChannel(interaction.channel);
    queue.startControlUpdate();
    await interaction.followUp("> Enable GUI mode!");
  }

  @Slash({ description: "Hide GUI controls", name: "gui-hide" })
  async guiHide(
    interaction: CommandInteraction,
    client: Client,
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    queue.stopControlUpdate();
    await interaction.followUp("> Disabled GUI mode!");
  }
}
