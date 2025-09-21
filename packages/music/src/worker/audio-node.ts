/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { parentPort } from "worker_threads";
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioResource,
  StreamType,
  type VoiceConnection,
} from "@discordjs/voice";

import {
  AudioNodeEvent,
  ParentProcessEvent,
  type AudioNodeEventPayload,
  type NodeAudioData,
  type NodePlayerOptions,
  type ParentProcessDataPayload,
} from "../types/index.js";
import { ytdl } from "./ytdl.js";

export class AudioNode {
  public audioPlayer: AudioPlayer;
  public guildId: string;
  public channelId: string | null;
  public volume = 100;

  private send(eventPayload: AudioNodeEventPayload): void {
    const payloadData: NodeAudioData = {
      channelId: this.channelId,
      guildId: this.guildId,
      payload: eventPayload,
    };

    const payload: ParentProcessDataPayload = {
      data: payloadData,
      op: ParentProcessEvent.AudioNodeEvent,
    };

    parentPort?.postMessage(payload);
  }

  constructor(public connection: VoiceConnection) {
    this.audioPlayer = new AudioPlayer();
    this.guildId = this.connection.joinConfig.guildId;
    this.channelId = this.connection.joinConfig.channelId;
    connection.subscribe(this.audioPlayer);
    this.setupEvents();
  }

  private setupEvents() {
    this.audioPlayer.on("debug", (message) => {
      this.send({
        message,
        type: AudioNodeEvent.Debug,
      });
    });

    this.audioPlayer.on("stateChange", (oldState, newState) => {
      this.send({
        newState: newState.status,
        oldState: oldState.status,
        type: AudioNodeEvent.StateChange,
      });
    });
  }

  public sendPlaybackInfo(): void {
    let ended = true;
    let playbackDuration = 0;
    const playerStatus = this.audioPlayer.state.status;

    if (playerStatus !== AudioPlayerStatus.Idle) {
      ended = this.audioPlayer.state.resource.ended;
      playbackDuration = this.audioPlayer.state.resource.playbackDuration;
    }

    this.send({
      ended,
      playbackDuration,
      playerStatus,
      type: AudioNodeEvent.PlaybackInfo,
    });
  }

  public play(options: NodePlayerOptions): void {
    const stream = ytdl(options.query, {
      fmt: "s16le",
      highWaterMark: 1 << 25,
      opusEncoded: false,
      quality: "highestaudio",
      seek: options.seek,
    });

    const audioResource = createAudioResource(stream, {
      inlineVolume: true,
      inputType: StreamType.Raw,
      metadata: this,
    });

    audioResource.volume?.setVolumeLogarithmic(this.volume / 100);

    this.audioPlayer.play(audioResource);
  }

  public destroy(): void {
    this.connection.destroy();
  }

  public setVolume(volume: number): void {
    this.volume = volume;
    if (this.audioPlayer.state.status === AudioPlayerStatus.Playing) {
      this.audioPlayer.state.resource.volume?.setVolume(this.volume / 100);
    }
  }

  public pause(): void {
    this.audioPlayer.pause();
  }

  public resume(): void {
    this.audioPlayer.unpause();
  }

  public stop(): void {
    this.audioPlayer.stop();
  }
}
