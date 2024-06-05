/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type {
  OpResponse,
  VoiceServerUpdate,
  VoiceStateUpdate,
} from "@discordx/lava-player";
import { LoadType, Node } from "@discordx/lava-player";
import type { CommandInteraction } from "discord.js";
import {
  ApplicationCommandOptionType,
  GatewayDispatchEvents,
  GuildMember,
} from "discord.js";
import type { ArgsOf, Client } from "discordx";
import { Discord, Once, Slash, SlashOption } from "discordx";

@Discord()
export class MusicPlayer {
  node: Node | undefined;

  @Once()
  ready(_: ArgsOf<"ready">, client: Client): void {
    const nodeInstance = new Node({
      host: {
        address: process.env.LAVA_HOST ?? "localhost",
        connectionOptions: { sessionId: "discordx" },
        port: process.env.LAVA_PORT ? Number(process.env.LAVA_PORT) : 2333,
      },

      // your Lavalink password
      password: process.env.LAVA_PASSWORD ?? "youshallnotpass",

      send(guildId, packet) {
        const guild = client.guilds.cache.get(guildId);
        if (guild) {
          guild.shard.send(packet);
        }
      },
      userId: client.user?.id ?? "", // the user id of your bot
    });

    nodeInstance.connection.ws.on("message", (data) => {
      const raw = JSON.parse(data.toString()) as OpResponse;
      console.log("ws>>", raw);
    });

    nodeInstance.on("error", (e) => {
      console.log(e);
    });

    client.ws.on(
      GatewayDispatchEvents.VoiceStateUpdate,
      (data: VoiceStateUpdate) => {
        nodeInstance.voiceStateUpdate(data);
      },
    );

    client.ws.on(
      GatewayDispatchEvents.VoiceServerUpdate,
      (data: VoiceServerUpdate) => {
        nodeInstance.voiceServerUpdate(data);
      },
    );

    this.node = nodeInstance;
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
    await player.join({ channel: interaction.member.voice.channelId });

    interaction.followUp("I am ready to rock :smile:");

    return;
  }

  @Slash({ description: "bot will leave your music channel" })
  async leave(interaction: CommandInteraction): Promise<void> {
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
    await player.leave();

    interaction.followUp("Left it!");
    return;
  }

  @Slash({ description: "destroy player" })
  async destroy(interaction: CommandInteraction): Promise<void> {
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
    await player.destroy();

    interaction.followUp("Destroyed it!");
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
    interaction: CommandInteraction,
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
      await player.join({ channel: interaction.member.voice.channelId });
    }

    const version = await this.node.rest.getVersion();
    console.log(`>> Version: ${version}`);
    const res = await this.node.rest.load(`ytsearch:${song}`);
    if (res.loadType !== LoadType.SEARCH) {
      interaction.followUp("Track could not be loaded");
      return;
    }

    const track = res.data[0];
    if (track) {
      await player.update({
        track,
      });
      await interaction.followUp(`playing ${track.info.title}`);
    } else {
      await interaction.followUp("Song not found with given input");
    }

    return;
  }
}
