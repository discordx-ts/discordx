/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { EventEmitter } from "events";

import type { BaseNode } from "../base/base-node.js";
import type { Rest } from "../index.js";
import type {
  OPEvent,
  UpdatePlayer,
  VoiceServerUpdate,
  VoiceStateUpdate,
} from "../types/index.js";
import {
  EventType,
  OPType,
  PlayerStatus,
  TrackEndReason,
} from "../types/index.js";
import type { HttpClient } from "./http.js";

export interface JoinOptions {
  channel: string | null;
  deaf?: boolean;
  mute?: boolean;
}

export class GuildPlayer<T extends BaseNode = BaseNode> extends EventEmitter {
  public readonly node: T;
  public guildId: string;
  public status: PlayerStatus = PlayerStatus.INSTANTIATED;

  get rest(): Rest {
    return this.node.rest;
  }

  get http(): HttpClient {
    return this.node.rest.http;
  }

  constructor(node: T, guildId: string) {
    super();
    this.node = node;
    this.guildId = guildId;

    this.on(OPType.EVENT, (d: OPEvent) => {
      switch (d.type) {
        case EventType.TrackStartEvent:
          this.status = PlayerStatus.PLAYING;
          break;

        case EventType.TrackEndEvent:
          if (d.reason !== TrackEndReason.REPLACED) {
            this.status = PlayerStatus.ENDED;
          }
          break;

        case EventType.TrackExceptionEvent:
          this.status = PlayerStatus.ERRORED;
          break;

        case EventType.TrackStuckEvent:
          this.status = PlayerStatus.STUCK;
          break;

        case EventType.WebSocketClosedEvent:
          this.status = PlayerStatus.ENDED;
          break;

        default:
          this.status = PlayerStatus.UNKNOWN;
          break;
      }
    });
  }

  public get playing(): boolean {
    return this.status === PlayerStatus.PLAYING;
  }

  public get paused(): boolean {
    return this.status === PlayerStatus.PAUSED;
  }

  public get voiceServer(): VoiceServerUpdate | undefined {
    return this.node.voiceServers.get(this.guildId);
  }

  public get voiceState(): VoiceStateUpdate | undefined {
    return this.node.voiceStates.get(this.guildId);
  }

  public async destroy(): Promise<void> {
    await this.node.rest.destroyPlayer(this.guildId);
    this.status = PlayerStatus.ENDED;
    this.node.guildPlayerStore.delete(this.guildId);
  }

  public join({ channel, deaf, mute }: JoinOptions): Promise<any> {
    this.node.voiceServers.delete(this.guildId);
    this.node.voiceStates.delete(this.guildId);

    return this.node.send(this.guildId, {
      d: {
        channel_id: channel,
        guild_id: this.guildId,
        self_deaf: deaf ?? false,
        self_mute: mute ?? false,
      },
      op: 4,
    });
  }

  public leave(): Promise<any> {
    return this.join({ channel: null });
  }

  public async moveTo(node: BaseNode): Promise<void> {
    if (this.node === node) {
      return;
    }

    if (!this.voiceServer || !this.voiceState) {
      throw new Error("no voice state/server data to move");
    }

    await this.destroy();
    await Promise.all([
      node.voiceStateUpdate(this.voiceState),
      node.voiceServerUpdate(this.voiceServer),
    ]);
  }

  public async update(payload: UpdatePlayer): Promise<void> {
    await this.node.rest.updatePlayer(this.guildId, payload);
    this.status = PlayerStatus.PLAYING;
  }
}
