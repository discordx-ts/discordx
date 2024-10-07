/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { AudioPlayerStatus } from "@discordjs/voice";
import type { Client } from "discord.js";
import shuffle from "lodash/shuffle.js";

import type { Node } from "./node.js";
import type { JoinData, PlaybackInfoAudioNodePayload } from "./types/index.js";

export interface Track {
  /**
   * Initial seek position on milliseconds
   */
  seek?: number;
  /**
   * Youtube URL of track
   */
  url: string;
}

export enum RepeatMode {
  OFF = "OFF",
  REPEAT_ALL = "REPEAT_ALL",
  REPEAT_ONE = "REPEAT_ONE",
}

export class Queue<T extends Track = Track> {
  private _leaveOnFinish = true;
  private _currentPlaybackTrack: T | null = null;
  private _playbackInfo: PlaybackInfoAudioNodePayload | null = null;
  private _playerState: AudioPlayerStatus = AudioPlayerStatus.Idle;
  private _repeatMode = RepeatMode.OFF;
  private _volume = 100;
  private _tracks: T[] = [];
  private _pingIntervalId: NodeJS.Timeout | null = null;

  get leaveOnFinish(): boolean {
    return this._leaveOnFinish;
  }

  get client(): Client {
    return this.node.client;
  }

  get tracks(): readonly T[] {
    return this._tracks;
  }

  get currentPlaybackTrack(): T | null {
    return this._currentPlaybackTrack;
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

  get size(): number {
    return this.tracks.length;
  }

  constructor(
    public node: Node,
    public guildId: string,
  ) {
    // empty constructor
  }

  /**
   * Starts a ping to keep the playback information updated.
   */
  public startPing(): void {
    this.stopPing();
    this._pingIntervalId = setInterval(() => {
      this.node.pingPlaybackInfo({ guildId: this.guildId });
    }, 1000);
  }

  /**
   * Stops the ping for updating playback information.
   */
  public stopPing(): void {
    if (this._pingIntervalId !== null) {
      clearInterval(this._pingIntervalId);
      this._pingIntervalId = null;
    }
  }

  /**
   * Adds tracks to the end of the queue.
   * @param track - The tracks to be added.
   */
  public addTrack(...track: T[]): void {
    this._tracks.push(...track);
  }

  /**
   * Adds tracks to the beginning of the queue.
   * @param track - The tracks to be added.
   */
  public addTrackFirst(...track: T[]): void {
    this._tracks.unshift(...track);
  }

  /**
   * Changes the position of a track in the queue.
   * @param oldIndex - The current index of the track.
   * @param newIndex - The new index for the track.
   * @throws Will throw an error if the indices are out of bounds.
   */
  public changeTrackPosition(oldIndex: number, newIndex: number): void {
    if (
      oldIndex < 0 ||
      oldIndex >= this.size ||
      newIndex < 0 ||
      newIndex >= this.size
    ) {
      throw new Error("Invalid track position");
    }
    const [movedTrack] = this._tracks.splice(oldIndex, 1);
    if (movedTrack) {
      this._tracks.splice(newIndex, 0, movedTrack);
    }
  }

  /**
   * Exits the player, clearing the queue and destroying the LavaPlayer instance.
   */
  exit(): void {
    this._currentPlaybackTrack = null;
    this.removeAllTracks();
    this.leave();
  }

  /**
   * Joins a voice channel.
   * @param data - The data required to join the channel.
   */
  public join(data: Omit<JoinData, "guildId">): void {
    this.node.join({ ...data, guildId: this.guildId });
  }

  /**
   * Leaves the voice channel.
   */
  public leave(): void {
    this.stopPing();
    this.node.disconnect({ guildId: this.guildId });
  }

  /**
   * Pauses the playback.
   */
  public pause(): void {
    this.node.pause({ guildId: this.guildId });
  }

  /**
   * Plays the next track in the queue.
   * @returns The next track that was played or null if the queue is empty.
   */
  public playNext(): T | null {
    /**
     * If repeat mode is on, process it
     */
    if (
      this._currentPlaybackTrack !== null &&
      this.repeatMode !== RepeatMode.OFF
    ) {
      if (this.repeatMode === RepeatMode.REPEAT_ALL) {
        this.addTrack(this._currentPlaybackTrack);
      } else {
        this.addTrackFirst(this._currentPlaybackTrack);
      }
    }

    /**
     * Set current track to null
     */
    this._currentPlaybackTrack = null;

    /**
     * Process next track
     */
    const nextTrack = this._tracks.shift();
    if (!nextTrack) {
      return null;
    }

    this._currentPlaybackTrack = nextTrack;
    this.node.play({
      guildId: this.guildId,
      payload: {
        initialVolume: this.volume,
        query: nextTrack.url,
        seek: nextTrack.seek,
      },
    });

    return nextTrack;
  }

  /**
   * Removes tracks from the queue by their indices.
   * @param indices - The indices of the tracks to be removed.
   */
  public removeTracks(...indices: number[]): void {
    // Sort indices in descending order to avoid shifting issues while removing
    indices.sort((a, b) => b - a);
    for (const index of indices) {
      if (index >= 0 && index < this.size) {
        this._tracks.splice(index, 1);
      }
    }
  }

  /**
   * Removes all tracks from the queue.
   */
  public removeAllTracks(): void {
    this._tracks = [];
  }

  /**
   * Resumes the playback.
   */

  public resume(): void {
    this.node.resume({ guildId: this.guildId });
  }

  /**
   * Seek the playback to specific position
   * @param seconds in milliseconds
   */
  public seek(seconds: number): T | null {
    if (!this.currentPlaybackTrack) {
      return null;
    }

    this.node.play({
      guildId: this.guildId,
      payload: {
        initialVolume: this.volume,
        query: this.currentPlaybackTrack.url,
        seek: seconds,
      },
    });

    return this.currentPlaybackTrack;
  }

  /**
   * Set leave on finish state
   */
  public setLeaveOnFinish(value: boolean): void {
    this._leaveOnFinish = value;
  }

  /**
   * Set playback info
   */
  public setPlaybackInfo(info: PlaybackInfoAudioNodePayload) {
    this._playbackInfo = info;
  }

  /**
   * set player state
   */
  public setPlayerState(state: AudioPlayerStatus) {
    this._playerState = state;
  }

  /**
   * Sets the repeat mode for the queue.
   * @param mode - The repeat mode to be set.
   */
  public setRepeatMode(mode: RepeatMode): void {
    this._repeatMode = mode;
  }

  /**
   * Sets the volume for playback.
   * @param volume - The volume level to be set.
   */
  public setVolume(volume: number): void {
    this._volume = volume;
    this.node.setVolume({ guildId: this.guildId, volume });
  }

  /**
   * Shuffles the tracks in the queue.
   */
  public shuffleTracks(): void {
    this._tracks = shuffle(this.tracks);
  }

  /**
   * Skips the current track.
   */
  public skip(): void {
    this.node.stop({ guildId: this.guildId });
  }
}
