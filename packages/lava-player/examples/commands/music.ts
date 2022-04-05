import type { CommandInteraction } from "discord.js";
import { GuildMember } from "discord.js";
import type { ArgsOf, Client } from "discordx";
import { Discord, On, Slash, SlashOption } from "discordx";

import * as Lava from "../../src/index.js";

@Discord()
export class MusicPlayer {
  node: Lava.Node | undefined;

  @On("ready")
  onReady([]: ArgsOf<"ready">, client: Client): void {
    const nodeX = new Lava.Node({
      host: {
        address: process.env.LAVA_HOST ?? "",
        port: Number(process.env.LAVA_PORT) ?? 2333,
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

    nodeX.on("error", (e) => {
      console.log(e);
    });

    client.ws.on("VOICE_STATE_UPDATE", (data: Lava.VoiceStateUpdate) => {
      nodeX.voiceStateUpdate(data);
    });

    client.ws.on("VOICE_SERVER_UPDATE", (data: Lava.VoiceServerUpdate) => {
      nodeX.voiceServerUpdate(data);
    });

    this.node = nodeX;
  }

  @Slash("play")
  async play(
    @SlashOption("song") song: string,
    interaction: CommandInteraction
  ): Promise<void> {
    if (!(interaction.member instanceof GuildMember) || !interaction.guildId) {
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
