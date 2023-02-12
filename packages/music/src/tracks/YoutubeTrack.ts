import type { AudioResource } from "@discordjs/voice";
import { createAudioResource, StreamType } from "@discordjs/voice";

import type { CommonTrack } from "../index.js";
import { ytdl } from "../index.js";
import { Track } from "./Track.js";

/**
 * Track options
 */
export interface VideoItem {
  [key: string]: any;
  encoderArgs?: string[];
  quality?: "lowestaudio" | "highestaudio";
  seek?: number;
  title: string;
  url: string;
  ytdlRequestOptions?: object;
}

/**
 * Music track
 */
export class YoutubeTrack extends Track {
  constructor(public info: VideoItem) {
    super(info.title, info.url);
  }

  /**
   * Create audio resource
   * @returns
   */
  public createAudioResource(): AudioResource<CommonTrack> {
    const stream = ytdl(this.info.url, {
      encoderArgs: this.info?.encoderArgs,
      fmt: "s16le",
      highWaterMark: 1 << 25,
      opusEncoded: false,
      quality: this.info?.quality ?? "highestaudio",
      requestOptions: this.info?.ytdlRequestOptions,
      seek: this.info?.seek ? this.info.seek / 1e3 : 0,
    });

    return createAudioResource(stream, {
      inlineVolume: true,
      inputType: StreamType.Raw,
      metadata: this,
    });
  }
}
