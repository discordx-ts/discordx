import type { AudioResource } from "@discordjs/voice";
import { createAudioResource, StreamType } from "@discordjs/voice";
import type { GuildMember, User } from "discord.js";
import type ytpl from "ytpl";
import type { Video } from "ytsr";

import type { CommonTrack, Player } from "../index.js";
import { ytdl } from "../index.js";
import { Track } from "./Track.js";

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
  public createAudioResource(): AudioResource<CommonTrack> {
    const stream = ytdl(this.url, {
      encoderArgs: this.options?.encoderArgs,
      fmt: "s16le",
      highWaterMark: 1 << 25,
      opusEncoded: false,
      quality: this.options?.quality ?? "highestaudio",
      requestOptions: this.options?.ytdlRequestOptions,
      seek: this.options?.seek ? this.options.seek / 1e3 : 0,
    });

    return createAudioResource(stream, {
      inlineVolume: true,
      inputType: StreamType.Raw,
      metadata: this,
    });
  }
}
