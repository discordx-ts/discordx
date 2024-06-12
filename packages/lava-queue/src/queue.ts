/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import {
  type Player as LavaPlayer,
  PlayerStatus,
  type Track,
  type TrackResponse,
} from "@discordx/lava-player";
import shuffle from "lodash/shuffle.js";

import type { Player } from "./player.js";

export class Queue {
  private _tracks: Track[] = [];
  private _lastTrack: Track | null = null;
  private _position = 0;
  private _loop = false;
  private _repeat = false;

  get currentTrack(): Track | null {
    return this._lastTrack;
  }

  get nextTrack(): Track | undefined {
    return this._tracks[0];
  }

  get tracks(): readonly Track[] {
    return this._tracks;
  }

  get position(): number {
    return this._position;
  }

  get loop(): boolean {
    return this._loop;
  }

  get repeat(): boolean {
    return this._repeat;
  }

  get size(): number {
    return this.tracks.length;
  }

  get lavaPlayer(): LavaPlayer {
    return this.player.node.players.get(this.guildId);
  }

  constructor(
    private player: Player,
    public guildId: string,
  ) {
    // empty constructor
  }

  addTrack(...tracks: Track[]) {
    this._tracks.push(...tracks);
  }

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

  removeTracks(...indices: number[]): void {
    // Sort indices in descending order to avoid shifting issues while removing
    indices.sort((a, b) => b - a);
    for (const index of indices) {
      if (index >= 0 && index < this._tracks.length) {
        this._tracks.splice(index, 1);
      }
    }
  }

  removeAllTracks(): void {
    this._tracks = [];
  }

  shuffleTracks(): void {
    this._tracks = shuffle(this._tracks);
  }

  async playNext(): Promise<Track | null> {
    if (this.currentTrack) {
      if (this.loop && !this.repeat) {
        this.addTrack(this.currentTrack);
      }

      if (this.repeat) {
        this._tracks.unshift(this.currentTrack);
      }
    }

    const track = this._tracks.shift();
    if (!track) {
      this._lastTrack = null;
      return null;
    }

    const player = this.player.node.players.get(this.guildId);
    await player.update({ track: { encoded: track.encoded } });
    this._lastTrack = track;
    return track;
  }

  async pause(): Promise<void> {
    await this.lavaPlayer.update({ paused: true });
    this.lavaPlayer.status = PlayerStatus.PAUSED;
  }

  async resume(): Promise<void> {
    await this.lavaPlayer.update({
      paused: false,
    });
  }

  /**
   * Track Searching
   *
   * Lavalink supports searching via YouTube, YouTube Music, and Soundcloud.
   * To search, you must prefix your identifier with `ytsearch:`, `ytmsearch:`, or `scsearch:` respectively.
   * When a search prefix is used, the returned `loadType` will be `SEARCH_RESULT`.
   * Note that, disabling the respective source managers renders these search prefixes redundant.
   * Plugins may also implement prefixes to allow for more search engines.
   *
   * @param text - User input
   */
  search(text: string): Promise<TrackResponse> {
    return this.player.node.rest.loadTracks(text);
  }

  setPosition(position: number): void {
    this._position = position;
  }

  setLoop(state: boolean): void {
    this._loop = state;
  }

  setRepeat(state: boolean): void {
    this._repeat = state;
  }

  async setVolume(volume: number): Promise<void> {
    await this.lavaPlayer.update({
      volume,
    });
  }

  async exit(): Promise<void> {
    this._lastTrack = null;
    this.removeAllTracks();
    await this.lavaPlayer.destroy();
  }
}
