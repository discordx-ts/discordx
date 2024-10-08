/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type {
  VoiceServerUpdate,
  VoiceStateUpdate,
} from "@discordx/lava-player";
import { Node } from "@discordx/lava-player";
import { GatewayDispatchEvents } from "discord.js";
import type { Client } from "discordx";

export function getNode(client: Client): Node {
  const nodeX = new Node({
    host: {
      address: process.env.LAVA_HOST ?? "localhost",
      connectionOptions: { sessionId: client.botId },
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

  client.ws.on(
    GatewayDispatchEvents.VoiceStateUpdate,
    (data: VoiceStateUpdate) => {
      void nodeX.voiceStateUpdate(data);
    },
  );

  client.ws.on(
    GatewayDispatchEvents.VoiceServerUpdate,
    (data: VoiceServerUpdate) => {
      void nodeX.voiceServerUpdate(data);
    },
  );

  return nodeX;
}
