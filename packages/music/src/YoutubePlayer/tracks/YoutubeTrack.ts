import {
  AudioResource,
  StreamType,
  createAudioResource,
} from "@discordjs/voice";
import { CommonTrack, Player, Track, ytdl } from "..";
import { GuildMember, User } from "discord.js";
import { Video } from "ytsr";
import ytpl from "ytpl";

/**
 * Track options
 */
export interface ITrackOptions {
  encoderArgs?: string[];
  quality?: "lowestaudio" | "highestaudio";
  seek?: number;
  user?: User | GuildMember;
  ytdlRequestOptions?: object;
}

/**
 * Music track
 */
export class YoutubeTrack extends Track {
  public title: string;
  public url: string;

  constructor(
    public info: Video | ytpl.Item,
    public player: Player,
    public options?: ITrackOptions
  ) {
    super(info.title, info.url);
    this.title = info.title;
    this.url = info.url;
  }

  /**
   * Create audio resource
   * @returns
   */
  public createAudioResource(): Promise<AudioResource<CommonTrack>> {
    return new Promise((resolve, reject) => {
      const stream = ytdl(this.url, {
        encoderArgs: this.options?.encoderArgs,
        fmt: "s16le",
        highWaterMark: 1 << 25,
        opusEncoded: false,
        quality: this.options?.quality ?? "highestaudio",
        requestOptions: this.options?.ytdlRequestOptions,
        seek: this.options?.seek ? this.options.seek / 1e3 : 0,
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
