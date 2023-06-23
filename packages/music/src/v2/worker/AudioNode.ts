import type { VoiceConnection } from "@discordjs/voice";
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioResource,
  StreamType,
} from "@discordjs/voice";
import { parentPort } from "worker_threads";

import { ytdl } from "../../logic/ytdl.js";
import type {
  AudioNodeEventPayload,
  NodePlayerOptions,
  ParentProcessDataPayload,
} from "../types/index.js";
import { AudioNodeEvent, ParentProcessEvent } from "../types/index.js";

export class AudioNode {
  public audioPlayer: AudioPlayer;
  public guildId: string;
  public channelId: string | null;
  public volume = 100;

  private send(data: AudioNodeEventPayload): void {
    const payload: ParentProcessDataPayload = {
      channelId: this.channelId,
      data,
      guildId: this.guildId,
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
    this.audioPlayer.on("debug", (message) =>
      this.send({
        message,
        type: AudioNodeEvent.Debug,
      })
    );

    this.audioPlayer.on("stateChange", (oldState, newState) =>
      this.send({
        newState: newState.status,
        oldState: oldState.status,
        type: AudioNodeEvent.StateChange,
      })
    );
  }

  public play(options: NodePlayerOptions): void {
    const stream = ytdl(options.query, {
      fmt: "s16le",
      highWaterMark: 1 << 25,
      opusEncoded: false,
      quality: "highestaudio",
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
}
