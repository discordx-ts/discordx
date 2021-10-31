import { ArgsOf, Client, Discord, On, Slash, SlashOption } from "discordx";
import { CommandInteraction, GuildMember } from "discord.js";
import { Lava } from "../../../src";

@Discord()
export class music {
  node: Lava.Node | undefined;

  @On("ready")
  onReady([]: ArgsOf<"ready">, client: Client): void {
    const nodex = new Lava.Node({
      host: process.env.LAVA_HOST ?? "", // a URL to your lavalink instance without protocol (optional, can be used instead of specifying hosts option)
      password: process.env.LAVA_PASSWORD ?? "", // your Lavalink password
      send(guildId, packet) {
        const guild = client.guilds.cache.get(guildId);
        if (guild) {
          guild.shard.send(packet);
        }
      },
      shardCount: 0, // the total number of shards that your bot is running (optional, useful if you're load balancing)
      userID: client.user?.id ?? "", // the user ID of your bot
    });

    nodex.on("error", (e) => {
      console.log(e);
    });
    client.ws.on("VOICE_STATE_UPDATE", (data: Lava.VoiceStateUpdate) => {
      nodex.voiceStateUpdate(data);
    });

    client.ws.on("VOICE_SERVER_UPDATE", (data: Lava.VoiceServerUpdate) => {
      nodex.voiceServerUpdate(data);
    });

    this.node = nodex;
  }

  @Slash("play")
  async play(
    @SlashOption("song", { required: true }) song: string,
    interaction: CommandInteraction
  ): Promise<void> {
    if (!(interaction.member instanceof GuildMember)) {
      return;
    }

    if (this.node && interaction.member.voice.channelId) {
      const player = this.node.players.get(interaction.guildId);
      console.log(player.voiceServer);
      await player.join(interaction.member.voice.channelId);
      const res = await this.node.load(`ytsearch:${song}`);
      const track = res.tracks[0];
      if (track) {
        await player.play(track);
        interaction.reply("playing...");
        return;
      }
    }
    interaction.reply("can not play");
  }
}
