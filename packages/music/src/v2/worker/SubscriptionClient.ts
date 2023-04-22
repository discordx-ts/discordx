import type { DiscordGatewayAdapterLibraryMethods } from "@discordjs/voice";
import { joinVoiceChannel } from "@discordjs/voice";
import { parentPort } from "worker_threads";

import type { SubscriptionPayload } from "../types/index.js";
import { WorkerEvent } from "../types/index.js";
import { AudioNode } from "./AudioNode.js";

export class SubscriptionClient {
  public subscriptions = new Map<string, AudioNode>();
  public adapters = new Map<string, DiscordGatewayAdapterLibraryMethods>();

  public connect(config: SubscriptionPayload): void {
    const voiceConnection = joinVoiceChannel({
      adapterCreator: (adapter) => {
        this.adapters.set(config.guildId, adapter);
        return {
          destroy: () => {
            this.adapters.delete(config.guildId);
            this.subscriptions.delete(config.guildId);
            parentPort?.postMessage({
              d: {
                channelId: config.channelId,
                guildId: config.guildId,
              },
              op: WorkerEvent.CONNECTION_DESTROY,
            });
          },
          sendPayload: (payload) => {
            parentPort?.postMessage({
              d: {
                channelId: config.channelId,
                guildId: config.guildId,
                payload: payload,
              },
              op: WorkerEvent.VOICE_STATE_UPDATE,
            });
            return true;
          },
        };
      },
      channelId: config.channelId,
      guildId: config.guildId,
      selfDeaf: config.deafen ?? false,
    });

    this.subscriptions.set(
      voiceConnection.joinConfig.guildId,
      new AudioNode(voiceConnection)
    );
  }

  public disconnect(config: Pick<SubscriptionPayload, "guildId">): void {
    const node = this.subscriptions.get(config.guildId);
    if (node) {
      node.connection.destroy();
      this.subscriptions.delete(config.guildId);
    }
  }

  public disconnectAll(): void {
    for (const [id, node] of this.subscriptions) {
      node.connection.destroy();
      this.subscriptions.delete(id);
    }
  }
}
