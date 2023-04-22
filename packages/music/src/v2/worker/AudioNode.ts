import type { VoiceConnection } from "@discordjs/voice";
import { AudioPlayer, createAudioResource, StreamType } from "@discordjs/voice";

import { ytdl } from "../../logic/ytdl.js";
import type { NodePlayerOptions } from "../types/index.js";

export class AudioNode {
  public audioPlayer = new AudioPlayer();

  public constructor(public connection: VoiceConnection) {
    connection.subscribe(this.audioPlayer);
  }

  public get guildId(): string {
    return this.connection.joinConfig.guildId;
  }

  public get channelId(): string | null {
    return this.connection.joinConfig.channelId;
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

    this.audioPlayer.play(audioResource);
  }

  public destroy(): void {
    this.connection.destroy();
  }
}
