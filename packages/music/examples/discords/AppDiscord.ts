import { CommandInteraction, GuildMember } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { Player } from "../../src";

@Discord()
export class music {
  player: Player;
  constructor() {
    this.player = new Player();
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
    await queue.join(interaction.member.voice.channel);
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
    await queue.join(interaction.member.voice.channel);
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
    await queue.join(interaction.member.voice.channel);
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
