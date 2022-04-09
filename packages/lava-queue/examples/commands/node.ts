import * as Lava from "@discordx/lava-player";
import type { Client } from "discordx";

export function getNode(client: Client): Lava.Node {
  const nodeX = new Lava.Node({
    host: {
      address: process.env.LAVA_HOST ?? "localhost",
      connectionOptions: { resumeKey: client.botId, resumeTimeout: 15 },
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

  return nodeX;
}
