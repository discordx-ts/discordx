import type { CommandInteraction, Guild, TextBasedChannel } from "discord.js";
import { GuildMember } from "discord.js";
import { join } from "path";

import { Discord, Slash, SlashOption } from "../../../discordx/src/index.js";
import type { Queue } from "../../build/cjs/index.js";
import { CustomTrack, Player } from "../../build/cjs/index.js";

@Discord()
export class music {
  player: Player;
  channel: TextBasedChannel | undefined;

  constructor() {
    this.player = new Player();

    this.player.on("onStart", ([, track]) => {
      if (this.channel) {
        this.channel.send(`playing ${track} ${track.url ? track.url : ""}`);
      }
    });

    this.player.on("onFinishPlayback", ([]) => {
      if (this.channel) {
        this.channel.send(
          "all songs has been played, please queue up more songs :musical_note:"
        );
      }
    });

    this.player.on("onPause", ([]) => {
      if (this.channel) {
        this.channel.send("music paused");
      }
    });

    this.player.on("onResume", ([]) => {
      if (this.channel) {
        this.channel.send("music resumed");
      }
    });

    this.player.on("onError", ([, err, track]) => {
      if (this.channel) {
        this.channel.send(`Track: ${track}Error: ${err.message}`);
      }
    });

    this.player.on("onFinish", ([track]) => {
      if (this.channel) {
        this.channel.send(`Finished playing: ${track}`);
      }
    });

    this.player.on("onLoop", ([]) => {
      if (this.channel) {
        this.channel.send("music resumed");
      }
    });

    this.player.on("onRepeat", ([]) => {
      if (this.channel) {
        this.channel.send("music resumed");
      }
    });

    this.player.on("onSkip", ([]) => {
      if (this.channel) {
        this.channel.send("music resumed");
      }
    });

    this.player.on("onTrackAdd", ([, track]) => {
      if (this.channel) {
        this.channel.send(`added tracks in queue: ${track.length}`);
      }
    });

    this.player.on("onLoopEnabled", ([]) => {
      if (this.channel) {
        this.channel.send("loop mode enabled");
      }
    });

    this.player.on("onLoopDisabled", ([]) => {
      if (this.channel) {
        this.channel.send("loop mode disabled");
      }
    });

    this.player.on("onRepeatEnabled", ([]) => {
      if (this.channel) {
        this.channel.send("repeat mode enabled");
      }
    });

    this.player.on("onRepeatDisabled", ([]) => {
      if (this.channel) {
        this.channel.send("repeat mode disabled");
      }
    });

    this.player.on("onMix", ([, tracks]) => {
      if (this.channel) {
        this.channel.send(`mixed tracks: ${tracks.length}`);
      }
    });

    this.player.on("onVolumeUpdate", ([volume]) => {
      if (this.channel) {
        this.channel.send(`volume changed to: ${volume}`);
      }
    });
  }

  queue(guild: Guild): Queue {
    return this.player.queue(guild);
  }

  @Slash("play", { description: "Play a song" })
  async play(
    @SlashOption("song", { description: "song name" })
    songName: string,
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

    await interaction.deferReply();
    const queue = this.queue(interaction.guild);
    if (!queue.isReady) {
      this.channel = interaction.channel ?? undefined;
      await queue.join(interaction.member.voice.channel);
    }
    const status = await queue.play(songName);
    if (!status) {
      interaction.followUp("The song could not be found");
    } else {
      interaction.followUp("The requested song is being played");
    }
  }

  @Slash("playlist", { description: "Play a playlist" })
  async playlist(
    @SlashOption("playlist", { description: "playlist name" })
    playlistName: string,
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

    await interaction.deferReply();
    const queue = this.queue(interaction.guild);
    if (!queue.isReady) {
      this.channel = interaction.channel ?? undefined;
      await queue.join(interaction.member.voice.channel);
    }
    const status = await queue.playlist(playlistName);
    if (!status) {
      interaction.followUp("The playlist could not be found");
    } else {
      interaction.followUp("The requested playlist is being played");
    }
  }

  @Slash("spotify", { description: "Play a spotify link" })
  async spotify(
    @SlashOption("link", { description: "spotify link" })
    link: string,
    interaction: CommandInteraction
  ): Promise<void> {
    if (!interaction.guild) {
      return;
    }

    interaction.member = interaction.member as GuildMember | null;

    if (!interaction.member || !interaction.member.voice.channel) {
      interaction.reply("You are not in the voice channel");
      return;
    }

    await interaction.deferReply();
    const queue = this.queue(interaction.guild);
    if (!queue.isReady) {
      this.channel = interaction.channel ?? undefined;
      await queue.join(interaction.member.voice.channel);
    }
    const status = await queue.spotify(link);
    if (!status) {
      interaction.followUp("The spotify song/playlist could not be found");
    } else {
      interaction.followUp(
        "The requested spotify song/playlist is being played"
      );
    }
  }

  @Slash("custom-track", { description: "Play custom track" })
  async customTrack(interaction: CommandInteraction): Promise<void> {
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

    await interaction.deferReply();
    const queue = this.queue(interaction.guild);
    if (!queue.isReady) {
      this.channel = interaction.channel ?? undefined;
      await queue.join(interaction.member.voice.channel);
    }

    queue.playTrack(
      new CustomTrack(
        this.player,
        "My Custom Track",
        join(__dirname, "file.mp3")
      )
    );
    interaction.followUp("queued custom track");
  }

  validateInteraction(
    interaction: CommandInteraction
  ): undefined | { guild: Guild; member: GuildMember; queue: Queue } {
    if (!interaction.guild || !(interaction.member instanceof GuildMember)) {
      interaction.reply("could not process your request");
      return;
    }

    if (!interaction.member.voice.channel) {
      interaction.reply("You are not in the voice channel");
      return;
    }

    const queue = this.queue(interaction.guild);

    if (!queue.isReady) {
      interaction.reply("I'm not ready yet");
      return;
    }

    if (interaction.member.voice.channel.id !== queue.voiceChannelId) {
      interaction.reply("you are not in my voice channel");
      return;
    }

    return { guild: interaction.guild, member: interaction.member, queue };
  }

  @Slash("skip", { description: "skip track" })
  skip(interaction: CommandInteraction): void {
    const validate = this.validateInteraction(interaction);
    if (!validate) {
      return;
    }

    const { queue } = validate;

    queue.skip();
    interaction.reply("skipped current track");
  }

  @Slash("mix", { description: "mix tracks" })
  mix(interaction: CommandInteraction): void {
    const validate = this.validateInteraction(interaction);
    if (!validate) {
      return;
    }

    const { queue } = validate;

    queue.mix();
    interaction.reply("mixed queue");
  }

  @Slash("pause", { description: "pause music" })
  pause(interaction: CommandInteraction): void {
    const validate = this.validateInteraction(interaction);
    if (!validate) {
      return;
    }

    const { queue } = validate;

    if (queue.isPause) {
      interaction.reply("already paused");
      return;
    }

    queue.pause();
    interaction.reply("paused music");
  }

  @Slash("resume", { description: "resume music" })
  resume(interaction: CommandInteraction): void {
    const validate = this.validateInteraction(interaction);
    if (!validate) {
      return;
    }

    const { queue } = validate;

    if (queue.isPlaying) {
      interaction.reply("already playing");
      return;
    }

    queue.resume();
    interaction.reply("resumed music");
  }

  @Slash("seek", { description: "seek music" })
  seek(
    @SlashOption("time", {
      description: "seek time in seconds",
    })
    time: number,
    interaction: CommandInteraction
  ): void {
    const validate = this.validateInteraction(interaction);
    if (!validate) {
      return;
    }

    const { queue } = validate;

    if (!queue.isPlaying || !queue.currentTrack) {
      interaction.reply("currently not playing any song");
      return;
    }

    const state = queue.seek(time * 1e3);
    if (!state) {
      interaction.reply("could not seek");
      return;
    }
    interaction.reply("current music seeked");
  }

  @Slash("leave", { description: "stop music" })
  leave(interaction: CommandInteraction): void {
    const validate = this.validateInteraction(interaction);
    if (!validate) {
      return;
    }

    const { queue } = validate;
    queue.leave();
    interaction.reply("stopped music");
  }
}
