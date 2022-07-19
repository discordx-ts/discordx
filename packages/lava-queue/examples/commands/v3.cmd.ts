import * as Lava from "@discordx/lava-player";
import type {
  ButtonInteraction,
  CommandInteraction,
  Guild,
  TextBasedChannel,
} from "discord.js";
import { EmbedBuilder, GuildMember } from "discord.js";
import type { ArgsOf, Client } from "discordx";
import {
  ButtonComponent,
  Discord,
  Once,
  Slash,
  SlashChoice,
  SlashOption,
} from "discordx";

import { Player } from "../../src/index.js";
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
    skipBotChannel = false
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
      interaction.followUp(
        "The command could not be processed. Please try again"
      );
      return;
    }

    if (!interaction.member.voice.channelId) {
      interaction.followUp("Join a voice channel first");
      return;
    }

    const bot = interaction.guild?.members.cache.get(
      interaction.client.user?.id
    );

    if (!bot) {
      interaction.followUp("Having difficulty finding my place in this world");
      return;
    }

    if (
      !skipBotChannel &&
      interaction.member.voice.channelId !== bot.voice.channelId
    ) {
      interaction.followUp("join to my voice channel");
      return;
    }

    const queue = this.GetQueue(client.botId, interaction.guild.id);

    if (!queue) {
      interaction.followUp("The player is not ready yet, please wait");
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

  @Once("ready")
  async onReady([]: ArgsOf<"ready">, client: Client): Promise<void> {
    await wait(5e3);
    this.player[client.botId] = new Player(getNode(client));
  }

  // slashes

  @Slash()
  async play(
    @SlashChoice("URL", "SEARCH")
    @SlashOption("type", { type: "STRING" })
    type: "URL" | "SEARCH",
    @SlashOption("input", { type: "STRING" })
    input: string,
    interaction: CommandInteraction,
    client: Client
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction, true);
    if (!cmd) {
      return;
    }

    const { queue, member, channel } = cmd;

    await queue.lavaPlayer.join(member.voice.channelId, {
      deaf: true,
    });

    queue.channel = channel;

    let response: Lava.TrackResponse;

    if (type === "URL") {
      response = await queue.enqueue(input);
    } else {
      const searchResponse = await queue.search(input);
      const track = searchResponse.tracks[0];
      if (!track) {
        interaction.followUp("> no search result");
        return;
      }

      queue.tracks.push(track);
      response = {
        loadType: Lava.LoadType.TRACK_LOADED,
        playlistInfo: {},
        tracks: [track],
      };
    }

    if (
      queue.lavaPlayer.status === Lava.Status.INSTANTIATED ||
      queue.lavaPlayer.status === Lava.Status.UNKNOWN ||
      queue.lavaPlayer.status === Lava.Status.ENDED
    ) {
      queue.playNext();
    }

    const embed = new EmbedBuilder();
    embed.setTitle("Enqueued");
    if (response.playlistInfo.name) {
      embed.setDescription(
        `Enqueued song ${response.tracks.length} from ${response.playlistInfo.name}`
      );
    } else if (response.tracks.length === 1) {
      embed.setDescription(
        `Enqueued [${response.tracks[0]?.info.title}](<${response.tracks[0]?.info.uri}>)`
      );
    } else {
      embed.setDescription(`Enqueued ${response.tracks.length} tracks`);
    }

    interaction.followUp({ embeds: [embed] });
    return;
  }

  @Slash()
  async seek(
    @SlashOption("seconds") seconds: number,
    interaction: CommandInteraction,
    client: Client
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    if (!queue.currentTrack) {
      interaction.followUp("> I am not sure, I am playing anything");
      return;
    }

    if (seconds * 1000 > queue.currentTrack.info.length) {
      queue.playNext();
      interaction.followUp("> skipped the track instead");
      return;
    }

    queue.lavaPlayer.play(queue.currentTrack, { start: seconds * 1000 });

    interaction.followUp("> current track seeked");
    return;
  }

  // buttons

  @ButtonComponent("btn-next")
  async nextControl(
    interaction: ButtonInteraction,
    client: Client
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    queue.playNext();
    queue.updateControlMessage();

    // delete interaction
    interaction.deleteReply();
  }

  @ButtonComponent("btn-pause")
  async pauseControl(
    interaction: ButtonInteraction,
    client: Client
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    queue.isPlaying ? queue.pause() : queue.resume();
    queue.updateControlMessage();

    // delete interaction
    interaction.deleteReply();
  }

  @ButtonComponent("btn-leave")
  async leaveControl(
    interaction: ButtonInteraction,
    client: Client
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    queue.stop();
    await queue.lavaPlayer.leave();
    queue.updateControlMessage();

    // delete interaction
    interaction.deleteReply();
  }

  @ButtonComponent("btn-repeat")
  async repeatControl(
    interaction: ButtonInteraction,
    client: Client
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    queue.setRepeat(!queue.repeat);
    queue.updateControlMessage();

    // delete interaction
    interaction.deleteReply();
  }

  @ButtonComponent("btn-loop")
  async loopControl(
    interaction: ButtonInteraction,
    client: Client
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    queue.setLoop(!queue.loop);
    queue.updateControlMessage();

    // delete interaction
    interaction.deleteReply();
  }

  @ButtonComponent("btn-queue")
  async queueControl(
    interaction: ButtonInteraction,
    client: Client
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    queue.view(interaction as unknown as CommandInteraction);
  }

  @ButtonComponent("btn-mix")
  async mixControl(
    interaction: ButtonInteraction,
    client: Client
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    queue.shuffle();
    queue.updateControlMessage();

    // delete interaction
    await interaction.deleteReply();
  }

  @ButtonComponent("btn-controls")
  async controlsControl(
    interaction: ButtonInteraction,
    client: Client
  ): Promise<void> {
    const cmd = await this.ParseCommand(client, interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    queue.updateControlMessage({ force: true });

    // delete interaction
    interaction.deleteReply();
  }
}
