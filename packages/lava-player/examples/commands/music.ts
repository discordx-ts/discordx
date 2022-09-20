import type { CommandInteraction } from "discord.js";
import {
  ApplicationCommandOptionType,
  GatewayDispatchEvents,
  GuildMember,
} from "discord.js";
import type { ArgsOf, Client } from "discordx";
import { Discord, Once, Slash, SlashOption } from "discordx";

import type {
  VoiceServerUpdate,
  VoiceStateUpdate,
  WRawEventType,
} from "../../src/index.js";
import { Node } from "../../src/index.js";

@Discord()
export class MusicPlayer {
  node: Node | undefined;

  @Once()
  ready(_: ArgsOf<"ready">, client: Client): void {
    const nodeX = new Node({
      host: {
        address: process.env.LAVA_HOST ?? "localhost",
        connectionOptions: { resumeKey: "discordx", resumeTimeout: 15 },
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

    nodeX.connection.ws.on("message", (data) => {
      const raw = JSON.parse(data.toString()) as WRawEventType;
      console.log("ws>>", raw);
    });

    nodeX.on("error", (e) => {
      console.log(e);
    });

    client.ws.on(
      GatewayDispatchEvents.VoiceStateUpdate,
      (data: VoiceStateUpdate) => {
        nodeX.voiceStateUpdate(data);
      }
    );

    client.ws.on(
      GatewayDispatchEvents.VoiceServerUpdate,
      (data: VoiceServerUpdate) => {
        nodeX.voiceServerUpdate(data);
      }
    );

    this.node = nodeX;
  }

  @Slash({ description: "bot will join your music channel" })
  async join(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    if (!(interaction.member instanceof GuildMember) || !interaction.guildId) {
      interaction.followUp("could not process this command, try again");
      return;
    }

    if (!this.node) {
      interaction.followUp("lavalink player is not ready");
      return;
    }

    if (!interaction.member.voice.channelId) {
      interaction.followUp("please join a voice channel first");
      return;
    }

    const player = this.node.players.get(interaction.guildId);
    await player.join(interaction.member.voice.channelId, { deaf: true });

    interaction.followUp("I am ready to rock :smile:");

    return;
  }

  @Slash({ description: "play a song" })
  async play(
    @SlashOption({
      description: "song url or title",
      name: "song",
      type: ApplicationCommandOptionType.String,
    })
    song: string,
    interaction: CommandInteraction
  ): Promise<void> {
    await interaction.deferReply();

    if (!(interaction.member instanceof GuildMember) || !interaction.guildId) {
      interaction.followUp("could not process this command, try again");
      return;
    }

    if (!this.node) {
      interaction.followUp("lavalink player is not ready");
      return;
    }

    if (!interaction.member.voice.channelId) {
      interaction.followUp("please join a voice channel first");
      return;
    }

    const player = this.node.players.get(interaction.guildId);

    if (!player.voiceServer) {
      await player.join(interaction.member.voice.channelId, { deaf: true });
    }

    const res = await this.node.load(`ytsearch:${song}`);
    const track = res.tracks[0];

    if (track) {
      await player.play(track);
      await interaction.followUp(`playing ${track.info.title}`);
    } else {
      await interaction.followUp("Song not found with given input");
    }

    return;
  }
}
