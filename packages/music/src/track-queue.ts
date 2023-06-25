import { AudioPlayerStatus } from "@discordjs/voice";
import type { Client } from "discord.js";
import shuffle from "lodash/shuffle.js";

import type { QueueNode } from "./queue-node.js";
import { AudioNodeEvent } from "./types/audio-node.js";
import { ParentProcessEvent } from "./types/communication-parent.js";
import type { JoinData, PlaybackInfoAudioNodePayload } from "./types/index.js";
import { QueueEvent } from "./types/queue-node-event.js";

export type Track = {
  seek?: number;
  url: string;
};

export enum RepeatMode {
  None,
  All,
  One,
}

export class TrackQueue<T extends Track = Track> {
  private _currentTrack: T | null = null;
  private _playbackInfo: PlaybackInfoAudioNodePayload | null = null;
  private _playerState: AudioPlayerStatus = AudioPlayerStatus.Idle;
  private _repeatMode = RepeatMode.None;
  private _volume = 100;

  public client: Client;
  public tracks: T[] = [];
  private guildId: string;
  private intervalId: NodeJS.Timer | null = null;
  private queueNode: QueueNode;

  constructor(options: {
    client: Client;
    guildId: string;
    queueNode: QueueNode;
  }) {
    this.queueNode = options.queueNode;
    this.client = options.client;
    this.guildId = options.guildId;
    this.setupEvents();
  }

  get currentTrack(): T | null {
    return this._currentTrack;
  }

  get nextTrack(): T | null {
    return this.tracks[0] ?? null;
  }

  get playbackInfo(): PlaybackInfoAudioNodePayload | null {
    return this._playbackInfo;
  }

  get playerState(): AudioPlayerStatus {
    return this._playerState;
  }

  get isPlaying(): boolean {
    return this.playerState === AudioPlayerStatus.Playing;
  }

  get repeatMode(): RepeatMode {
    return this._repeatMode;
  }

  get volume(): number {
    return this._volume;
  }

  get queueSize(): number {
    return this.tracks.length;
  }

  public playNext(): void {
    // If repeat mode is on, process it
    if (this.currentTrack !== null && this.repeatMode !== RepeatMode.None) {
      if (this.repeatMode === RepeatMode.All) {
        this.tracks.push(this.currentTrack);
      } else {
        this.tracks.unshift(this.currentTrack);
      }
    }

    this._currentTrack = null;
    // Process next track
    const nextTrack = this.tracks.shift();
    if (!nextTrack) {
      return;
    }

    this._currentTrack = nextTrack;
    this.queueNode.play({
      guildId: this.guildId,
      payload: {
        initialVolume: this.volume,
        query: nextTrack.url,
        seek: nextTrack.seek,
      },
    });
  }

  private setupEvents(): void {
    this.queueNode.on(QueueEvent.ParentProcessEvent, (payload) => {
      if (payload.data.guildId !== this.guildId) {
        return;
      }

      if (payload.op === ParentProcessEvent.AudioNodeEvent) {
        // Playback info
        if (payload.data.payload.type === AudioNodeEvent.PlaybackInfo) {
          this._playbackInfo = payload.data.payload;
        }

        // When state change
        if (payload.data.payload.type === AudioNodeEvent.StateChange) {
          const { newState } = payload.data.payload;

          // sync player state
          this._playerState = newState;

          if (newState === AudioPlayerStatus.Playing) {
            this.startPing();
          } else {
            this.stopPing();
          }

          // Process queue, when player goes into idle state
          if (
            newState === AudioPlayerStatus.Idle ||
            newState === AudioPlayerStatus.AutoPaused
          ) {
            this.playNext();
          }
        }
      }
    });
  }

  private startPing(): void {
    this.stopPing();
    this.intervalId = setInterval(() => {
      this.queueNode.pingPlaybackInfo({ guildId: this.guildId });
    }, 1000);
  }

  private stopPing(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public addTrack(...track: T[]): void {
    this.tracks.push(...track);
  }

  public addTrackFirst(...track: T[]): void {
    this.tracks.unshift(...track);
  }

  public join(data: JoinData): void {
    this.queueNode.join(data);
  }

  public leave(): void {
    this.stopPing();
    this.queueNode.disconnect({ guildId: this.guildId });
  }

  public pause(): void {
    this.queueNode.pause({ guildId: this.guildId });
  }

  public setRepeatMode(mode: RepeatMode): void {
    this._repeatMode = mode;
  }

  public setVolume(volume: number): void {
    this._volume = volume;
    this.queueNode.setVolume({ guildId: this.guildId, volume });
  }

  public unpause(): void {
    this.queueNode.unpause({ guildId: this.guildId });
  }

  public skip(): void {
    this.queueNode.stop({ guildId: this.guildId });
  }

  public mix(): void {
    this.tracks = shuffle(this.tracks);
  }
}
