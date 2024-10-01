/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import {
  type GuildPlayer,
  type Node,
  PlayerStatus,
  type Track,
  type TrackResponse,
} from "@discordx/lava-player";
import shuffle from "lodash/shuffle.js";

import { RepeatMode } from "./util.js";

export class Queue {
  private _tracks: Track[] = [];
  private _currentPlaybackTrack: Track | null = null;
  private _currentPlaybackPosition = 0;
  private _repeatMode: RepeatMode = RepeatMode.OFF;
  private _leaveOnFinish = true;

  /**
   * Gets the current track being played.
   * @returns The current track that is being played or null if none.
   */
  get currentPlaybackTrack(): Track | null {
    return this._currentPlaybackTrack;
  }

  /**
   * Leave voice channel when track finish
   */
  get leaveOnFinish(): boolean {
    return this._leaveOnFinish;
  }

  /**
   * Gets the next track in the queue.
   * @returns The next track in the queue or undefined if the queue is empty.
   */
  get nextTrack(): Track | undefined {
    return this._tracks[0];
  }

  /**
   * Gets a read-only array of the tracks in the queue.
   * @returns The tracks in the queue.
   */
  get tracks(): readonly Track[] {
    return this._tracks;
  }

  /**
   * Gets the current playback position of the track.
   * @returns The current playback position of the track.
   */
  get currentPlaybackPosition() {
    return this._currentPlaybackPosition;
  }

  /**
   * Gets the repeat mode of the queue.
   * @returns The repeat mode.
   */
  get repeatMode(): RepeatMode {
    return this._repeatMode;
  }

  /**
   * Gets the size of the queue.
   * @returns The number of tracks in the queue.
   */
  get size() {
    return this.tracks.length;
  }

  /**
   * Gets the LavaPlayer instance associated with the queue.
   * @returns The LavaPlayer instance.
   */
  get guildPlayer(): GuildPlayer {
    return this.node.guildPlayerStore.get(this.guildId);
  }

  get http() {
    return this.guildPlayer.http;
  }

  get isPlaying() {
    return (
      this.currentPlaybackTrack !== null &&
      this.guildPlayer.status === PlayerStatus.PLAYING
    );
  }

  get rest() {
    return this.guildPlayer.rest;
  }

  get sessionId() {
    return this.node.sessionId;
  }

  constructor(
    public node: Node,
    public guildId: string,
  ) {
    // empty constructor
  }

  /**
   * Adds one or more tracks to the queue.
   * @param tracks - The tracks to be added to the queue.
   */
  addTrack(...tracks: Track[]) {
    this._tracks.push(...tracks);
  }

  /**
   * Adds one or more tracks to top of the queue.
   * @param tracks - The tracks to be added to the queue.
   */
  addTrackFirst(...tracks: Track[]) {
    this._tracks.unshift(...tracks);
  }

  /**
   * Changes the position of a track in the queue.
   * @param oldIndex - The current index of the track.
   * @param newIndex - The new index for the track.
   * @throws Will throw an error if the indices are out of bounds.
   */
  changeTrackPosition(oldIndex: number, newIndex: number): void {
    if (
      oldIndex < 0 ||
      oldIndex >= this._tracks.length ||
      newIndex < 0 ||
      newIndex >= this._tracks.length
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
  async exit(): Promise<void> {
    this._currentPlaybackTrack = null;
    this.removeAllTracks();
    await this.guildPlayer.leave();
    await this.guildPlayer.destroy();
  }

  /**
   * Plays the next track in the queue.
   * @returns The next track that was played or null if the queue is empty.
   */
  async playNext(): Promise<Track | null> {
    if (this.currentPlaybackTrack) {
      if (this.repeatMode === RepeatMode.REPEAT_ALL) {
        this.addTrack(this.currentPlaybackTrack);
      } else if (this.repeatMode === RepeatMode.REPEAT_ONE) {
        this.addTrackFirst(this.currentPlaybackTrack);
      }
    }

    const track = this._tracks.shift();
    if (!track) {
      this._currentPlaybackTrack = null;
      return null;
    }

    await this.guildPlayer.update({ track: { encoded: track.encoded } });
    this._currentPlaybackTrack = track;
    return track;
  }

  /**
   * Pauses the current track.
   */
  async pause(): Promise<void> {
    await this.guildPlayer.update({ paused: true });
    this.guildPlayer.status = PlayerStatus.PAUSED;
  }

  /**
   * Removes tracks from the queue by their indices.
   * @param indices - The indices of the tracks to be removed.
   */
  removeTracks(...indices: number[]): void {
    // Sort indices in descending order to avoid shifting issues while removing
    indices.sort((a, b) => b - a);
    for (const index of indices) {
      if (index >= 0 && index < this._tracks.length) {
        this._tracks.splice(index, 1);
      }
    }
  }

  /**
   * Removes all tracks from the queue.
   */
  removeAllTracks(): void {
    this._tracks = [];
  }

  /**
   * Resumes playing the current track.
   */
  async resume(): Promise<void> {
    await this.guildPlayer.update({
      paused: false,
    });
  }

  /**
   * Searches for tracks using Lavalink
   * @param text - The search text input by the user.
   * @returns The response from the Lavalink search.
   */
  search(text: string): Promise<TrackResponse> {
    return this.rest.loadTracks(text);
  }

  /**
   * Sets the repeat mode of the queue.
   * @param mode - The repeat mode to set.
   */
  setRepeatMode(mode: RepeatMode): void {
    this._repeatMode = mode;
  }

  /**
   * Sets the current playback position of the track.
   * @param time - The new playback position.
   */
  setPlaybackPosition(time: number): void {
    this._currentPlaybackPosition = time;
  }

  /**
   * Sets the volume of the player.
   * @param volume - The new volume level.
   */
  async setVolume(volume: number): Promise<void> {
    await this.guildPlayer.update({
      volume,
    });
  }

  /**
   * Shuffles the tracks in the queue.
   */
  shuffleTracks(): void {
    this._tracks = shuffle(this._tracks);
  }
}
