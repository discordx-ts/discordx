import {
  AudioPlayer,
  AudioPlayerStatus,
  AudioResource,
  DiscordGatewayAdapterCreator,
  VoiceConnection,
  VoiceConnectionDisconnectReason,
  VoiceConnectionStatus,
  createAudioPlayer,
  entersState,
  joinVoiceChannel,
} from "@discordjs/voice";
import { CommonTrack, ITrackOptions, Player, YoutubeTrack } from ".";
import { Guild, StageChannel, VoiceChannel } from "discord.js";
import { PlayerErrors, Util } from "..";
import { Video } from "ytsr";
import _ from "lodash";
import ytpl from "ytpl";

/**
 * Wait promise
 * @param time
 * @returns
 */
function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

/**
 * Guild queue
 */
export abstract class Queue<T extends Player = Player> {
  private _audioPlayer = createAudioPlayer();
  private _tracks: CommonTrack[] = [];
  private _voiceConnection: VoiceConnection | undefined;
  private lastTrack: CommonTrack | undefined;
  private loopMode = false;
  private queueLock = false;
  private readyLock = false;
  private repeatMode = false;

  /**
   * get total queued of tracks
   * @returns
   */
  public get size(): number {
    return this._tracks.length;
  }

  /**
   * get audioPlayer
   * @returns
   */
  public get audioPlayer(): AudioPlayer {
    return this._audioPlayer;
  }

  /**
   * get voiceConnection
   * @returns
   */
  public get voiceConnection(): VoiceConnection | undefined {
    return this._voiceConnection;
  }

  /**
   * get voice channel id
   * @returns
   */
  public get voiceChannelId(): string | undefined {
    return this._voiceConnection?.joinConfig.channelId ?? undefined;
  }

  /**
   * get voice group
   * @returns
   */
  public get voiceGroup(): string | undefined {
    return this._voiceConnection?.joinConfig.group ?? undefined;
  }

  /**
   * get voice group
   * @returns
   */
  public get voiceGuildId(): string | undefined {
    return this._voiceConnection?.joinConfig.guildId ?? undefined;
  }

  /**
   * get tracks
   * @returns
   */
  public get tracks(): CommonTrack[] {
    return this._tracks;
  }

  /**
   * get loop state
   * @returns
   */
  public get loop(): boolean {
    return this.loopMode;
  }

  /**
   * get reeat state
   * @returns
   */
  public get repeat(): boolean {
    return this.repeatMode;
  }

  /**
   * Check if voice voiceConnection ready
   * @returns
   */
  public get isReady(): boolean {
    return this._voiceConnection?.state.status === VoiceConnectionStatus.Ready;
  }

  /**
   * Is playing
   */
  public get isPlaying(): boolean {
    return this._audioPlayer.state.status === AudioPlayerStatus.Playing;
  }

  /**
   * Is Idle
   */
  public get isIdle(): boolean {
    return this._audioPlayer.state.status === AudioPlayerStatus.Idle;
  }

  /**
   * Is Idle
   */
  public get isPause(): boolean {
    return this._audioPlayer.state.status === AudioPlayerStatus.Paused;
  }

  /**
   * get current track
   */
  public get currentTrack(): AudioResource<CommonTrack> | undefined {
    if (this._audioPlayer.state.status === AudioPlayerStatus.Idle) {
      return undefined;
    }

    const track = this._audioPlayer.state
      .resource as AudioResource<CommonTrack>;

    return track;
  }

  /**
   * get next track
   */
  public get nextTrack(): CommonTrack | undefined {
    return this._tracks[0];
  }

  /**
   * get volume
   */
  public get volume(): number {
    if (!this.currentTrack?.volume) {
      return 100;
    }
    const currentVol = this.currentTrack.volume.volume;
    return Math.round(Math.pow(currentVol, 1 / 1.661) * 200);
  }

  /**
   * Get playbackDuration
   */
  public get playbackDuration(): number {
    if (!this.currentTrack) {
      return 0;
    }
    return this.currentTrack.playbackDuration;
  }

  constructor(public player: T, public guild: Guild) {
    this._audioPlayer.on("stateChange", (oldState, newState) => {
      if (
        newState.status === AudioPlayerStatus.Idle &&
        oldState.status !== AudioPlayerStatus.Idle
      ) {
        // If the Idle state is entered from a non-Idle state, it means that an audio resource has finished playing.
        // The queue is then processed to start playing the next track, if one is available.
        //
        const track = (oldState.resource as AudioResource<YoutubeTrack>)
          .metadata as YoutubeTrack;
        this.player.emit("onFinish", [this, track]);
        void this.processQueue();
      } else if (newState.status === AudioPlayerStatus.Playing) {
        // If the Playing state has been entered, then a new track has started playback.

        const track = (newState.resource as AudioResource<YoutubeTrack>)
          .metadata as YoutubeTrack;
        this.player.emit("onStart", [this, track]);
      }
    });

    this._audioPlayer.on("error", (error) => {
      this.player.emit("onError", [
        this,
        error,
        (error.resource as AudioResource<YoutubeTrack>).metadata,
      ]);
    });
  }

  /**
   * Process queue
   * @returns
   */
  private async processQueue(): Promise<void> {
    // If the queue is locked (already being processed), is empty, or the audio player is already playing something, return
    if (
      this.queueLock ||
      this._audioPlayer.state.status !== AudioPlayerStatus.Idle
    ) {
      return;
    }

    // Lock the queue to guarantee safe access
    this.queueLock = true;

    if (this.loopMode && this.lastTrack) {
      this.player.emit("onLoop", [this, this.lastTrack]);
      this.enqueue([this.lastTrack], true);
    }

    // Take the first item from the queue. This is guaranteed to exist due to the non-empty check above.
    const nextTrack = this._tracks.shift();
    if (!nextTrack) {
      this.queueLock = false;
      this.player.emit("onFinishPlayback", [this]);
      return;
    }

    if (this.repeatMode) {
      this.player.emit("onRepeat", [this, nextTrack]);
      this.enqueue([nextTrack]);
    }

    this.lastTrack = nextTrack;

    try {
      // Attempt to convert the YoutubeTrack into an AudioResource (i.e. start streaming the video)
      const resource = await nextTrack.createAudioResource();
      this._audioPlayer.play(resource);
      this.queueLock = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // If an error occurred, try the next item of the queue instead
      this.player.emit("onError", [
        this,
        error,
        (error.resource as AudioResource<CommonTrack>).metadata,
      ]);
      this.queueLock = false;
      return this.processQueue();
    }
  }

  /**
   * Join voice channel
   * @param channel
   */
  public async join(
    channel: VoiceChannel | StageChannel,
    options?: { force?: boolean; group?: string }
  ): Promise<void> {
    if (this._voiceConnection && !options?.force) {
      return;
    }

    if (this._voiceConnection) {
      if (
        this._voiceConnection.state.status !== VoiceConnectionStatus.Destroyed
      ) {
        this._voiceConnection.destroy();
      }
      this._voiceConnection = undefined;
    }

    const _voiceConnection = joinVoiceChannel({
      adapterCreator: channel.guild
        .voiceAdapterCreator as DiscordGatewayAdapterCreator,
      channelId: channel.id,
      group: options?.group,
      guildId: channel.guild.id,
    });

    _voiceConnection.subscribe(this._audioPlayer);

    _voiceConnection.on("stateChange", async (oldState, newState) => {
      if (newState.status === VoiceConnectionStatus.Disconnected) {
        if (
          newState.reason === VoiceConnectionDisconnectReason.WebSocketClose &&
          newState.closeCode === 4014
        ) {
          try {
            await entersState(
              _voiceConnection,
              VoiceConnectionStatus.Connecting,
              5_000
            );
            // Probably moved voice channel
          } catch {
            _voiceConnection.destroy();
            // Probably removed from voice channel
          }
        } else if (_voiceConnection.rejoinAttempts < 5) {
          // The disconnect in this case is recoverable, and we also have <5 repeated attempts so we will reconnect.
          await wait((_voiceConnection.rejoinAttempts + 1) * 5_000);
          _voiceConnection.rejoin();
        } else {
          // The disconnect in this case may be recoverable, but we have no more remaining attempts - destroy.
          _voiceConnection.destroy();
        }
      } else if (newState.status === VoiceConnectionStatus.Destroyed) {
        // Once destroyed, stop the subscription
        this.leave();
      } else if (
        !this.readyLock &&
        (newState.status === VoiceConnectionStatus.Connecting ||
          newState.status === VoiceConnectionStatus.Signalling)
      ) {
        this.readyLock = true;
        try {
          await entersState(
            _voiceConnection,
            VoiceConnectionStatus.Ready,
            20_000
          );
        } catch {
          if (
            _voiceConnection.state.status !== VoiceConnectionStatus.Destroyed
          ) {
            _voiceConnection.destroy();
          }
        } finally {
          this.readyLock = false;
        }
      }
    });

    try {
      await entersState(_voiceConnection, VoiceConnectionStatus.Ready, 20e3);
    } catch (err) {
      throw Error(PlayerErrors.VoiceConnection);
    }

    this._voiceConnection = _voiceConnection;
    this.player.emit("onJoin", [this, channel]);
  }

  /**
   * Leave voice channel
   */
  public leave(): void {
    this._tracks = [];
    this._audioPlayer.stop(true);
    if (this._voiceConnection) {
      if (
        this._voiceConnection.state.status !== VoiceConnectionStatus.Destroyed
      ) {
        this._voiceConnection.destroy();
      }
      this._voiceConnection = undefined;
    }

    this.player.emit("onLeave", [this]);
  }

  /**
   * Clear track queue
   */
  public clearTracks(): void {
    this._tracks = [];
  }

  /**
   * Remove indexed track
   * @param index array of track index
   * @returns
   */
  public removeTracks(index: number[]): CommonTrack[] {
    return _.pullAt(this._tracks, index);
  }

  /**
   * Set volume
   */
  public setVolume(volume: number): boolean {
    if (
      !this.currentTrack ||
      isNaN(volume) ||
      volume < 0 ||
      volume >= Infinity
    ) {
      return false;
    }

    this.currentTrack.volume?.setVolumeLogarithmic(volume / 200);
    this.player.emit("onVolumeUpdate", [this, volume]);
    return true;
  }

  /**
   * Seek current music
   */
  public seek(time: number): boolean {
    if (!this.currentTrack || !this.isPlaying) {
      return false;
    }

    const track = this.currentTrack.metadata;
    if (track.isCustomTrack()) {
      return false;
    }

    const newTrack = new YoutubeTrack(track.info, this.player, { seek: time });
    this.enqueue([newTrack], true);
    this._audioPlayer.stop();
    this.player.emit("onSeek", [this, newTrack, time]);
    return true;
  }

  /**
   * Skip playback
   */
  public skip(): boolean {
    if (!this.isPlaying) {
      return false;
    }

    this.player.emit("onSkip", [this, this.currentTrack]);
    this._audioPlayer.stop();
    return true;
  }

  /**
   * Pause audio playback
   */
  public pause(): boolean {
    if (!this.isPlaying) {
      return false;
    }

    this._audioPlayer.pause();
    this.player.emit("onPause", [this]);
    return true;
  }

  /**
   * Resume audio playback
   */
  public resume(): boolean {
    if (!this.isPause) {
      return false;
    }

    this._audioPlayer.unpause();
    this.player.emit("onResume", [this]);
    return true;
  }

  /**
   * Mix tracks
   */
  public mix(): void {
    this._tracks = _.shuffle(this._tracks);
    this.player.emit("onMix", [this, this._tracks]);
  }

  /**
   * Repeat tracks
   */
  public setRepeat(state: boolean): void {
    this.repeatMode = state;
    if (state) {
      this.player.emit("onRepeatEnabled", [this]);
    } else {
      this.player.emit("onRepeatDisabled", [this]);
    }
  }

  /**
   * Enable loop
   */
  public setLoop(state: boolean): void {
    this.loopMode = state;
    if (state) {
      this.player.emit("onLoopEnabled", [this]);
    } else {
      this.player.emit("onLoopDisabled", [this]);
    }
  }

  /**
   * Adds a new YoutubeTrack to the queue.
   *
   * @param track The track to add to the queue
   */
  public enqueue(track: CommonTrack[], top?: boolean): void {
    if (top) {
      this._tracks.unshift(...track);
    } else {
      this._tracks.push(...track);
    }

    this.player.emit("onTrackAdd", [this, track]);
  }

  /**
   * play custom track
   * @param track
   * @param options
   * @returns
   */
  public playTrack(
    track: CommonTrack,
    options?: { enqeueTop?: boolean; playNow?: boolean }
  ): CommonTrack {
    // enqueue track
    this.enqueue([track], options?.enqeueTop);

    // force stop, if play now requested
    if (this.isPlaying && options?.playNow) {
      this.audioPlayer.stop();
    }

    this.processQueue();
    return track;
  }

  /**
   * play song
   * @param search
   * @param options
   * @param enqueueTop
   * @returns
   */
  public async play(
    search: string | Video,
    options?: ITrackOptions,
    playNow?: boolean,
    enqueueTop?: boolean
  ): Promise<YoutubeTrack | undefined> {
    const video =
      typeof search === "string" ? await Util.getSong(search) : search;
    if (!video) {
      return;
    }

    const track = new YoutubeTrack(video, this.player, options);
    this.enqueue([track], enqueueTop);
    if (this.isPlaying && playNow) {
      this.audioPlayer.stop();
    }

    this.processQueue();
    return track;
  }

  /**
   * play playlist
   * @param search
   * @param options
   * @param enqueueTop
   * @returns
   */
  public async playlist(
    search: string | ytpl.Result,
    options?: ITrackOptions,
    enqueueTop?: boolean
  ): Promise<YoutubeTrack[] | undefined> {
    const playlist =
      typeof search === "string" ? await Util.getPlaylist(search) : search;
    if (!playlist) {
      return;
    }

    const tracks = playlist.items.map(
      (video) => new YoutubeTrack(video, this.player, options)
    );
    this.enqueue(tracks, enqueueTop);
    this.processQueue();
    return tracks;
  }

  /**
   * Play spotify
   * @param search
   * @param options
   * @param enqueueTop
   * @returns
   */
  public async spotify(
    search: string,
    options?: ITrackOptions,
    enqueueTop?: boolean
  ): Promise<YoutubeTrack[] | undefined> {
    const spotifyTracks =
      typeof search === "string" ? await Util.getSpotifyTracks(search) : search;
    if (!spotifyTracks) {
      return;
    }

    const allVideos = await Promise.all(
      spotifyTracks.map((sr) =>
        Util.getSong(
          sr.name +
            " - " +
            `${sr.artists ? sr.artists.map((ar) => ar.name).join(", ") : ""}`
        )
      )
    );
    const videos = _.compact(allVideos);
    const tracks = videos.map(
      (video) => new YoutubeTrack(video, this.player, options)
    );
    this.enqueue(tracks, enqueueTop);
    this.processQueue();
    return tracks;
  }
  /**
   * Play apple
   * @param search
   * @param options
   * @param enqueueTop
   * @returns
   */
   public async apple(
    search: string,
    options?: ITrackOptions,
    enqueueTop?: boolean
  ): Promise<YoutubeTrack[] | undefined> {
    const appleTracks =
      typeof search === "string" ? await Util.getAppleTracks(search) : search;
    if (!appleTracks) {
      return;
    }
    let allVideos: (Video | undefined)[] = [];
    if (appleTracks.type === "song") {
        const song = await Util.getSong(
            appleTracks.title +
            " - " +
            appleTracks.artist
        );
        allVideos = [song];
    };
    if (appleTracks.type === 'playlist' || appleTracks.type === 'album') {

        allVideos = await Promise.all(
            appleTracks.tracks.map((sr) =>
            Util.getSong(
              sr.title +
                " - " +
                sr.artist
            )
          )
        );
    }
    const videos = _.compact(allVideos);
    const tracks = videos.map(
      (video) => new YoutubeTrack(video, this.player, options)
    );
    this.enqueue(tracks, enqueueTop);
    this.processQueue();
    return tracks;
  }
}
