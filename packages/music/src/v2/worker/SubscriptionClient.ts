import type { DiscordGatewayAdapterLibraryMethods } from "@discordjs/voice";
import { joinVoiceChannel } from "@discordjs/voice";
import { parentPort } from "worker_threads";

import {
  type ParentProcessDataPayload,
  ParentProcessEvent,
  type SubscriptionPayload,
} from "../types/index.js";
import { AudioNode } from "./AudioNode.js";

export class SubscriptionClient {
  public subscriptions: Map<string, AudioNode> = new Map<string, AudioNode>();
  public adapters: Map<string, DiscordGatewayAdapterLibraryMethods> = new Map<
    string,
    DiscordGatewayAdapterLibraryMethods
  >();

  private send(payload: ParentProcessDataPayload): void {
    parentPort?.postMessage(payload);
  }

  public connect(config: SubscriptionPayload): void {
    const adapterCreator = (adapter: DiscordGatewayAdapterLibraryMethods) => {
      this.adapters.set(config.guildId, adapter);
      return {
        destroy: () => {
          this.handleConnectionDestroy(config.guildId, config.channelId);
        },
        sendPayload: (payload: any) => {
          this.handleVoiceStateUpdate(
            config.guildId,
            config.channelId,
            payload
          );
          return true;
        },
      };
    };

    const voiceConnection = joinVoiceChannel({
      adapterCreator,
      channelId: config.channelId,
      guildId: config.guildId,
      selfDeaf: config.deafen ?? false,
    });

    this.subscriptions.set(config.guildId, new AudioNode(voiceConnection));
  }

  public disconnect(config: Pick<SubscriptionPayload, "guildId">): void {
    const node = this.subscriptions.get(config.guildId);
    if (node) {
      node.destroy();
      this.subscriptions.delete(config.guildId);
    }
  }

  public disconnectAll(): void {
    for (const [id, node] of this.subscriptions) {
      node.destroy();
      this.subscriptions.delete(id);
    }
  }

  private handleConnectionDestroy(guildId: string, channelId: string): void {
    this.adapters.delete(guildId);
    this.subscriptions.delete(guildId);
    this.send({
      data: { channelId, guildId },
      op: ParentProcessEvent.ConnectionDestroy,
    });
  }

  private handleVoiceStateUpdate(
    guildId: string,
    channelId: string,
    payload: any
  ): void {
    this.send({
      data: { channelId, guildId, payload },
      op: ParentProcessEvent.VoiceStateUpdate,
    });
  }
}
