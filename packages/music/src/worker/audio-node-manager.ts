/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { DiscordGatewayAdapterLibraryMethods } from "@discordjs/voice";
import { joinVoiceChannel } from "@discordjs/voice";
import { parentPort } from "worker_threads";

import type {
  GuildData,
  JoinData,
  ParentProcessDataPayload,
  PlayData,
  SetVolumeData,
} from "../types/index.js";
import { ParentProcessEvent } from "../types/index.js";
import { AudioNode } from "./audio-node.js";

export class AudioNodeManager {
  public nodes: Map<string, AudioNode> = new Map<string, AudioNode>();
  public adapters: Map<string, DiscordGatewayAdapterLibraryMethods> = new Map<
    string,
    DiscordGatewayAdapterLibraryMethods
  >();

  private send(payload: ParentProcessDataPayload): void {
    parentPort?.postMessage(payload);
  }

  public connect(config: JoinData): void {
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
            payload,
          );
          return true;
        },
      };
    };

    const voiceConnection = joinVoiceChannel({
      adapterCreator,
      channelId: config.channelId,
      group: config.group,
      guildId: config.guildId,
      selfDeaf: config.deafen,
    });

    this.nodes.set(config.guildId, new AudioNode(voiceConnection));
  }

  private handleConnectionDestroy(guildId: string, channelId: string): void {
    this.adapters.delete(guildId);
    this.nodes.delete(guildId);
    this.send({
      data: { channelId, guildId },
      op: ParentProcessEvent.ConnectionDestroy,
    });
  }

  private handleVoiceStateUpdate(
    guildId: string,
    channelId: string,
    payload: any,
  ): void {
    this.send({
      data: {
        channelId,
        guildId,
        payload,
      },
      op: ParentProcessEvent.VoiceStateUpdate,
    });
  }

  public disconnectAll(): void {
    for (const [id, node] of this.nodes) {
      node.destroy();
      this.nodes.delete(id);
    }
  }

  public disconnect(config: GuildData): void {
    const node = this.nodes.get(config.guildId);
    if (!node) {
      this.send({
        data: { guildId: config.guildId },
        op: ParentProcessEvent.AudioNodeNotFound,
      });

      return;
    }

    node.destroy();
    this.nodes.delete(config.guildId);
  }

  public sendPlaybackInfo(data: GuildData): void {
    const node = this.nodes.get(data.guildId);
    if (!node) {
      this.send({
        data: { guildId: data.guildId },
        op: ParentProcessEvent.AudioNodeNotFound,
      });

      return;
    }

    node.sendPlaybackInfo();
  }

  public play(data: PlayData): void {
    const node = this.nodes.get(data.guildId);
    if (!node) {
      this.send({
        data: { guildId: data.guildId },
        op: ParentProcessEvent.AudioNodeNotFound,
      });

      return;
    }

    node.play(data.payload);
  }

  public setVolume(data: SetVolumeData): void {
    const node = this.nodes.get(data.guildId);
    if (!node) {
      this.send({
        data: { guildId: data.guildId },
        op: ParentProcessEvent.AudioNodeNotFound,
      });

      return;
    }

    node.setVolume(data.volume);
  }

  public pause(data: GuildData): void {
    const node = this.nodes.get(data.guildId);
    if (!node) {
      this.send({
        data: { guildId: data.guildId },
        op: ParentProcessEvent.AudioNodeNotFound,
      });

      return;
    }

    node.pause();
  }

  public resume(data: GuildData): void {
    const node = this.nodes.get(data.guildId);
    if (!node) {
      this.send({
        data: { guildId: data.guildId },
        op: ParentProcessEvent.AudioNodeNotFound,
      });

      return;
    }

    node.resume();
  }

  public stop(data: GuildData): void {
    const node = this.nodes.get(data.guildId);
    if (!node) {
      this.send({
        data: { guildId: data.guildId },
        op: ParentProcessEvent.AudioNodeNotFound,
      });

      return;
    }

    node.stop();
  }
}
