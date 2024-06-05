/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
/* eslint-disable camelcase */
import { EventEmitter } from "events";

import type { BaseNode } from "../base/Node.js";
import type {
  EqualizerBand,
  FilterOptions,
  JoinOptions,
  OPEvent,
  PlayerOptions,
  Track,
  VoiceServerUpdate,
  VoiceStateUpdate,
} from "../types/index.js";
import { EventType, Status, TrackEndReason } from "../types/index.js";

export class Player<T extends BaseNode = BaseNode> extends EventEmitter {
  public readonly node: T;
  public guildId: string;
  public status: Status = Status.INSTANTIATED;

  constructor(node: T, guildId: string) {
    super();
    this.node = node;
    this.guildId = guildId;

    this.on("event", (d: OPEvent) => {
      switch (d.type) {
        case EventType.TrackStartEvent:
          this.status = Status.PLAYING;
          break;

        case EventType.TrackEndEvent:
          if (d.reason !== TrackEndReason.REPLACED) {
            this.status = Status.ENDED;
          }
          break;

        case EventType.TrackExceptionEvent:
          this.status = Status.ERRORED;
          break;

        case EventType.TrackStuckEvent:
          this.status = Status.STUCK;
          break;

        case EventType.WebSocketClosedEvent:
          this.status = Status.ENDED;
          break;

        default:
          this.status = Status.UNKNOWN;
          break;
      }
    });
  }

  public get playing(): boolean {
    return this.status === Status.PLAYING;
  }

  public get paused(): boolean {
    return this.status === Status.PAUSED;
  }

  public get voiceState(): VoiceStateUpdate | undefined {
    const state = this.node.voiceStates.get(this.guildId);
    if (!state) {
      return;
    }

    return state;
  }

  public get voiceServer(): VoiceServerUpdate | undefined {
    return this.node.voiceServers.get(this.guildId);
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

  public leave(): Promise<any> {
    return this.join(null);
  }

  public join(
    channel: string | null,
    { deaf = false, mute = false }: JoinOptions = {},
  ): Promise<any> {
    this.node.voiceServers.delete(this.guildId);
    this.node.voiceStates.delete(this.guildId);

    return this.node.send(this.guildId, {
      d: {
        channel_id: channel,
        guild_id: this.guildId,
        self_deaf: deaf,
        self_mute: mute,
      },
      op: 4,
    });
  }

  public async play(
    track: string | Track,
    { start, end, noReplace, pause }: PlayerOptions = {},
  ): Promise<void> {
    await Promise.resolve();
    await this.send("play", {
      endTime: end,
      noReplace,
      pause,
      startTime: start,
      track: typeof track === "object" ? track.encoded : track,
    });

    this.status = Status.PLAYING;
  }

  public setVolume(vol: number): Promise<void> {
    return this.send("volume", { volume: vol });
  }

  public setEqualizer(bands: EqualizerBand[]): Promise<void> {
    return this.send("equalizer", { bands });
  }

  public setFilters(options: FilterOptions): Promise<void> {
    return this.send("filters", options);
  }

  public seek(position: number): Promise<void> {
    return this.send("seek", { position });
  }

  public async pause(paused = true): Promise<void> {
    await this.send("pause", { pause: paused });

    if (paused) {
      this.status = Status.PAUSED;
    } else {
      this.status = Status.PLAYING;
    }
  }

  public async stop(): Promise<void> {
    await this.send("stop");
    this.status = Status.ENDED;
  }

  public async destroy(): Promise<void> {
    if (this.node.connected) {
      await this.send("destroy");
    }
    this.status = Status.ENDED;
    this.node.players.delete(this.guildId);
  }

  public voiceUpdate(
    sessionId: string,
    event: VoiceServerUpdate,
  ): Promise<void> {
    return this.send("voiceUpdate", {
      event,
      sessionId,
    });
  }

  public send(op: string, d: object = {}): Promise<void> {
    const conn = this.node.connection;
    if (conn) {
      return conn.send(
        Object.assign(
          {
            guildId: this.guildId,
            op,
          },
          d,
        ),
      );
    } else {
      return Promise.reject(new Error("no WebSocket connection available"));
    }
  }
}
