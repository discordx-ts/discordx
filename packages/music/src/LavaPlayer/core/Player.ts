/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import {
  EqualizerBand,
  EventType,
  FilterOptions,
  JoinOptions,
  PlayerOptions,
  Status,
  Track,
  VoiceServerUpdate,
  VoiceStateUpdate,
} from "../types/index.js";
import BaseNode from "../base/Node.js";
import { EventEmitter } from "events";
import { deprecate } from "util";

export default class Player<
  T extends BaseNode = BaseNode
> extends EventEmitter {
  public readonly node: T;
  public guildId: string;
  public status: Status = Status.INSTANTIATED;

  constructor(node: T, guildId: string) {
    super();
    this.node = node;
    this.guildId = guildId;

    this.on("event", (d) => {
      switch (d.type) {
        case EventType.TRACK_START:
          this.status = Status.PLAYING;
          break;
        case EventType.TRACK_END:
          if (d.reason !== "REPLACED") {
            this.status = Status.ENDED;
          }
          break;
        case EventType.TRACK_EXCEPTION:
          this.status = Status.ERRORED;
          break;
        case EventType.TRACK_STUCK:
          this.status = Status.STUCK;
          break;
        case EventType.WEBSOCKET_CLOSED:
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
    const session = this.node.voiceStates.get(this.guildId);
    if (!session) {
      return;
    }

    return {
      guild_id: this.guildId,
      session_id: session,
      user_id: this.node.userID,
    };
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
    { deaf = false, mute = false }: JoinOptions = {}
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
    { start, end, noReplace, pause }: PlayerOptions = {}
  ): Promise<void> {
    await this.send("play", {
      endTime: end,
      noReplace,
      pause,
      startTime: start,
      track: typeof track === "object" ? track.track : track,
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
    event: VoiceServerUpdate
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
          d
        )
      );
    } else {
      return Promise.reject(new Error("no WebSocket connection available"));
    }
  }
}

Player.prototype.setVolume = deprecate(
  Player.prototype.setVolume,
  "Player#setVolume: use setFilters instead"
);

Player.prototype.setEqualizer = deprecate(
  Player.prototype.setEqualizer,
  "Player#setEqualizer: use setFilters instead"
);
