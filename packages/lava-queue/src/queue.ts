import type {
  Player as LavaPlayer,
  Track,
  TrackResponse,
} from "@discordx/lava-player";
import shuffle from "lodash/shuffle.js";

import type { Player } from "./player.js";

export class Queue {
  private _tracks: Track[] = [];
  private _lastTrack?: Track;
  private _position = 0;
  private _loop = false;
  private _repeat = false;

  get currentTrack(): Track | undefined {
    return this._lastTrack;
  }

  get nextTrack(): Track | undefined {
    return this._tracks[0];
  }

  get tracks(): Track[] {
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

  clear(): void {
    this._tracks = [];
  }

  async enqueue(id: string): Promise<TrackResponse> {
    const response = await this.player.node.load(id);

    if (response.tracks.length) {
      this.tracks.push(...response.tracks);
    }

    return response;
  }

  fromMS(duration: number): string {
    const seconds = Math.floor((duration / 1e3) % 60);
    const minutes = Math.floor((duration / 6e4) % 60);
    const hours = Math.floor(duration / 36e5);
    const secondsPad = `${seconds}`.padStart(2, "0");
    const minutesPad = `${minutes}`.padStart(2, "0");
    const hoursPad = `${hours}`.padStart(2, "0");
    return `${hours ? `${hoursPad}:` : ""}${minutesPad}:${secondsPad}`;
  }

  pause(): void {
    this.lavaPlayer.pause(true);
  }

  playNext(): boolean {
    if (this.currentTrack) {
      if (this.loop && !this.repeat) {
        this.tracks.push(this.currentTrack);
      }

      if (this.repeat) {
        this.tracks.unshift(this.currentTrack);
      }
    }

    const track = this.tracks.shift();
    if (!track) {
      this._lastTrack = undefined;
      return false;
    }

    this._lastTrack = track;
    const player = this.player.node.players.get(this.guildId);
    player.play(track);

    return true;
  }

  resume(): void {
    this.lavaPlayer.pause(false);
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
    return this.player.node.load(text);
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
    await this.lavaPlayer.setVolume(volume);
  }

  shuffle(): void {
    this._tracks = shuffle(this._tracks);
  }

  stop(): void {
    this._lastTrack = undefined;
    this.clear();
    this.lavaPlayer.stop();
  }
}
