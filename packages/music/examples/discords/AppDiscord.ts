import { CommandInteraction, GuildMember, TextBasedChannels } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { Player } from "../../src";

@Discord()
export class music {
  player: Player;
  channel: TextBasedChannels | undefined;

  constructor() {
    this.player = new Player();

    this.player.on("onStart", ([track]) => {
      if (this.channel) {
        this.channel.send(`playing ${track} ${track.url}`);
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

    this.player.on("onError", ([err, track]) => {
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

    this.player.on("onTrackAdd", ([track]) => {
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

    this.player.on("onMix", ([tracks]) => {
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

  @Slash("play", { description: "Play a song" })
  async play(
    @SlashOption("song", { description: "song name", required: true })
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
    const queue = this.player.queue(interaction.guild);
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
    @SlashOption("playlist", { description: "playlist name", required: true })
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
    const queue = this.player.queue(interaction.guild);
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
    @SlashOption("link", { description: "spotify link", required: true })
    link: string,
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
    const queue = this.player.queue(interaction.guild);
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
}
