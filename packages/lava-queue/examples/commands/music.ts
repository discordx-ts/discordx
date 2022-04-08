import * as Lava from "@discordx/lava-player";
import {
  Pagination,
  PaginationResolver,
  PaginationType,
} from "@discordx/pagination";
import type {
  ButtonInteraction,
  CommandInteraction,
  ContextMenuInteraction,
  TextBasedChannel,
} from "discord.js";
import {
  GuildMember,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import type { ArgsOf, Client } from "discordx";
import { ButtonComponent, Discord, Once, Slash, SlashOption } from "discordx";

import { Player, Queue } from "../../src/index.js";

class MusicQueue extends Queue {
  channelId?: string;
  lastControlMessage?: Message;
  timeoutTimer?: NodeJS.Timeout;
  lockUpdate = false;

  get isPlaying() {
    return this.lavaPlayer.status === Lava.Status.PLAYING;
  }

  constructor(
    player: Player,
    guildId: string,
    public channel?: TextBasedChannel
  ) {
    super(player, guildId);
    setInterval(() => this.updateControlMessage(), 1e4);
  }

  private controlsRow(): MessageActionRow[] {
    const nextButton = new MessageButton()
      .setLabel("Next")
      .setEmoji("⏭")
      .setStyle("PRIMARY")
      .setDisabled(!this.isPlaying)
      .setCustomId("btn-next");

    const pauseButton = new MessageButton()
      .setLabel(this.isPlaying ? "Pause" : "Resume")
      .setEmoji(this.isPlaying ? "⏸️" : "▶️")
      .setStyle("PRIMARY")
      .setCustomId("btn-pause");

    const stopButton = new MessageButton()
      .setLabel("Stop")
      .setStyle("DANGER")
      .setCustomId("btn-leave");

    const repeatButton = new MessageButton()
      .setLabel("Repeat")
      .setEmoji("🔂")
      .setDisabled(!this.isPlaying)
      .setStyle(this.repeat ? "DANGER" : "PRIMARY")
      .setCustomId("btn-repeat");

    const loopButton = new MessageButton()
      .setLabel("Loop")
      .setEmoji("🔁")
      .setDisabled(!this.isPlaying)
      .setStyle(this.loop ? "DANGER" : "PRIMARY")
      .setCustomId("btn-loop");

    const row1 = new MessageActionRow().addComponents(
      stopButton,
      pauseButton,
      nextButton,
      repeatButton
    );

    const queueButton = new MessageButton()
      .setLabel("Queue")
      .setEmoji("🎵")
      .setStyle("PRIMARY")
      .setCustomId("btn-queue");
    const mixButton = new MessageButton()
      .setLabel("Shuffle")
      .setEmoji("🎛️")
      .setDisabled(!this.isPlaying)
      .setStyle("PRIMARY")
      .setCustomId("btn-mix");
    const controlsButton = new MessageButton()
      .setLabel("Controls")
      .setEmoji("🔄")
      .setStyle("PRIMARY")
      .setCustomId("btn-controls");

    const row2 = new MessageActionRow().addComponents(
      loopButton,
      queueButton,
      mixButton,
      controlsButton
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
    const embed = new MessageEmbed();
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

    embed.addField(
      "Now Playing" +
        (this.size > 2 ? ` (Total: ${this.size} tracks queued)` : ""),
      `[${currentTrack.info.title}](${currentTrack.info.uri})`
    );

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

    const bar = (this.isPlaying ? "▶️" : "⏸️") + " " + progressString;
    const currentTime = this.fromMS(timeNow);
    const endTime = this.fromMS(timeTotal);
    const spacing = bar.length - currentTime.length - endTime.length;
    const time =
      "`" + currentTime + " ".repeat(spacing * 3 - 2) + endTime + "`";

    embed.addField(bar, time);

    embed.addField(
      "Next Song",
      nextTrack
        ? `[${nextTrack.info.title}](${nextTrack.info.uri})`
        : "No upcoming song"
    );

    const pMsg = {
      components: [...this.controlsRow()],
      content: options?.text,
      embeds: [embed],
    };

    try {
      if (!this.lastControlMessage || options?.force) {
        if (this.lastControlMessage) {
          await this.lastControlMessage.delete().catch(() => null);
          this.lastControlMessage = undefined;
        }

        this.lastControlMessage = await this.channel?.send(pMsg);
      } else {
        await this.lastControlMessage.edit(pMsg);
      }
    } catch (err) {
      // ignore
      console.log(err);
    }

    this.lockUpdate = false;
  }

  public async view(
    interaction: Message | CommandInteraction | ContextMenuInteraction,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    client: Client
  ): Promise<void> {
    if (!this.currentTrack) {
      const pMsg = await interaction.reply({
        content:
          "> The queue could not be processed at the moment, please try again later!",
        ephemeral: true,
      });

      if (pMsg instanceof Message) {
        setTimeout(() => pMsg.delete(), 3000);
      }
      return;
    }

    if (!this.size) {
      const pMsg = await interaction.reply(
        `> Playing **${this.currentTrack.info.title}**`
      );
      if (pMsg instanceof Message) {
        setTimeout(() => pMsg.delete(), 1e4);
      }
      return;
    }

    const current = `> Playing **[${this.currentTrack.info.title}](<${
      this.currentTrack.info.uri
    }>)** out of ${this.size + 1}`;

    const pageOptions = new PaginationResolver((index, paginator) => {
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
            }>)` + ` (${this.fromMS(track.info.length)})`
        )
        .join("\n\n");

      return { content: `${current}\n\n${queue}` };
    }, Math.round(this.size / 10));

    await new Pagination(interaction, pageOptions, {
      enableExit: true,
      onTimeout: (index, message) => {
        if (message.deletable) {
          message.delete();
        }
      },
      time: 6e4,
      type:
        Math.round(this.size / 10) <= 5
          ? PaginationType.Button
          : PaginationType.SelectMenu,
    }).send();
  }
}

@Discord()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MusicPlayer {
  player: Player | undefined;

  GetQueue(guildId: string, channel: TextBasedChannel): MusicQueue | null {
    if (!this.player) {
      return null;
    }

    const queue = new MusicQueue(this.player, guildId, channel);
    return this.player.queue(guildId, () => queue);
  }

  ParseCommand(
    interaction: CommandInteraction | ButtonInteraction,
    skipBotChannel = false
  ) {
    if (
      !interaction.channel ||
      !(interaction.member instanceof GuildMember) ||
      !interaction.guild ||
      !interaction.client.user
    ) {
      interaction.reply("The command could not be processed. Please try again");
      return;
    }

    if (!interaction.member.voice.channelId) {
      interaction.reply("Join a voice channel first");
      return;
    }

    const bot = interaction.guild?.members.cache.get(
      interaction.client.user?.id
    );

    if (!bot) {
      interaction.reply("Having difficulty finding my place in this world");
      return;
    }

    if (
      !skipBotChannel &&
      interaction.member.voice.channelId !== bot.voice.channelId
    ) {
      interaction.reply("join to my voice channel dumbass");
      return;
    }

    const queue = this.GetQueue(interaction.guild.id, interaction.channel);

    if (!queue) {
      interaction.reply("The player is not ready yet, please wait");
      return;
    }

    return {
      channel: interaction.channel,
      guild: interaction.guild,
      member: interaction.member,
      queue,
    };
  }

  @Once("ready")
  onReady([]: ArgsOf<"ready">, client: Client): void {
    const nodeX = new Lava.Node({
      host: {
        address: process.env.LAVA_HOST ?? "localhost",
        // connectionOptions: { resumeKey: "discordx", resumeTimeout: 15 },
        port: process.env.LAVA_PORT ? Number(process.env.LAVA_PORT) : 2333,
      },

      // your Lavalink password
      password: process.env.LAVA_PASSWORD ?? "",

      send(guildId, packet) {
        const guild = client.guilds.cache.get(guildId);
        if (guild) {
          guild.shard.send(packet);
        }
      },
      shardCount: 0, // the total number of shards that your bot is running (optional, useful if you're load balancing)
      userId: client.user?.id ?? "", // the user id of your bot
    });

    client.ws.on("VOICE_STATE_UPDATE", (data: Lava.VoiceStateUpdate) => {
      nodeX.voiceStateUpdate(data);
    });

    client.ws.on("VOICE_SERVER_UPDATE", (data: Lava.VoiceServerUpdate) => {
      nodeX.voiceServerUpdate(data);
    });

    this.player = new Player(nodeX);
  }

  @Slash()
  async play(
    @SlashOption("id") id: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const cmd = this.ParseCommand(interaction, true);
    if (!cmd) {
      return;
    }

    const { queue, member } = cmd;
    await interaction.deferReply();

    if (!queue.lavaPlayer.voiceServer) {
      await queue.lavaPlayer.join(member.voice.channelId, {
        deaf: true,
      });

      queue.channelId = interaction.channelId;
    }

    const response = await queue.enqueue(id);

    if (
      queue.lavaPlayer.status === Lava.Status.INSTANTIATED ||
      queue.lavaPlayer.status === Lava.Status.UNKNOWN ||
      queue.lavaPlayer.status === Lava.Status.ENDED
    ) {
      queue.playNext();
    }

    const embed = new MessageEmbed();
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
  seek(
    @SlashOption("seconds") seconds: number,
    interaction: CommandInteraction
  ): void {
    const cmd = this.ParseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    if (!queue.currentTrack) {
      interaction.reply("> I am not sure, I am playing anything");
      return;
    }

    if (seconds * 1000 > queue.currentTrack.info.length) {
      queue.playNext();
      interaction.reply("> skipped the track instead");
      return;
    }

    queue.lavaPlayer.play(queue.currentTrack, { start: seconds * 1000 });

    interaction.reply("> current track seeked");
    return;
  }

  @ButtonComponent("btn-next")
  async nextControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = this.ParseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    queue.playNext();
    queue.updateControlMessage();

    // delete interaction
    await interaction.deferReply();
    interaction.deleteReply();
  }

  @ButtonComponent("btn-pause")
  async pauseControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = this.ParseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    queue.isPlaying ? queue.pause() : queue.resume();
    queue.updateControlMessage();

    // delete interaction
    await interaction.deferReply();
    interaction.deleteReply();
  }

  @ButtonComponent("btn-leave")
  async leaveControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = this.ParseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    queue.stop();
    queue.updateControlMessage();

    // delete interaction
    await interaction.deferReply();
    interaction.deleteReply();
  }

  @ButtonComponent("btn-repeat")
  async repeatControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = this.ParseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    queue.setRepeat(!queue.repeat);
    queue.updateControlMessage();

    // delete interaction
    await interaction.deferReply();
    interaction.deleteReply();
  }

  @ButtonComponent("btn-queue")
  queueControl(interaction: ButtonInteraction, client: Client): void {
    const cmd = this.ParseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    queue.view(interaction as unknown as CommandInteraction, client);
  }

  @ButtonComponent("btn-mix")
  async mixControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = this.ParseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    queue.shuffle();
    queue.updateControlMessage();

    // delete interaction
    await interaction.deferReply();
    interaction.deleteReply();
  }

  @ButtonComponent("btn-controls")
  async controlsControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = this.ParseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    queue.updateControlMessage({ force: true });

    // delete interaction
    await interaction.deferReply();
    interaction.deleteReply();
  }
}
