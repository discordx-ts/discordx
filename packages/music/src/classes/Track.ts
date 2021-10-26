import * as ytpl from "ytpl";
import {
  AudioResource,
  StreamType,
  createAudioResource,
} from "@discordjs/voice";
import { Player } from ".";
import { Video } from "ytsr";
import { ytdl } from "..";

/**
 * Track options
 */
export interface ITrackOptions {
  seek?: number;
  quality?: "lowestaudio" | "highestaudio";
  ytdlRequestOptions?: object;
  encoderArgs?: string[];
}

/**
 * Music track
 */
export class Track {
  public title: string;
  public url: string;

  constructor(
    public info: Video | ytpl.Item,
    public player: Player,
    public options?: ITrackOptions
  ) {
    this.title = info.title;
    this.url = info.url;
  }

  /**
   * Create audio resource
   * @returns
   */
  public createAudioResource(): Promise<AudioResource<Track>> {
    return new Promise((resolve, reject) => {
      const stream = ytdl(this.url, {
        encoderArgs: this.options?.encoderArgs,
        fmt: "s16le",
        highWaterMark: 1 << 25,
        opusEncoded: false,
        quality: this.options?.quality ?? "highestaudio",
        requestOptions: this.options?.ytdlRequestOptions,
        seek: this.options?.seek ? this.options.seek / 1000 : 0,
      }).on("error", (error: Error) => {
        reject(error);
      });

      resolve(
        createAudioResource(stream, {
          inputType: StreamType.Raw,
          metadata: this,
        })
      );
    });
  }
}
