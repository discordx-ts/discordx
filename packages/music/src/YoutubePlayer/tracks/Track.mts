import { CustomTrack, YoutubeTrack } from "./index.mjs";
import { AudioResource } from "@discordjs/voice";
import internal from "node:stream";

export type CommonTrack = YoutubeTrack | CustomTrack;

export abstract class Track {
  constructor(
    public title: string,
    public url?: string,
    public source?: string | internal.Readable
  ) {
    // empty constructor
  }

  /**
   * return title
   * @returns
   */
  toString(): string {
    return this.title;
  }

  abstract createAudioResource():
    | AudioResource<CommonTrack>
    | Promise<AudioResource<CommonTrack>>;

  isCustomTrack(): this is CustomTrack {
    return !!this.source;
  }

  isYoutubeTrack(): this is YoutubeTrack {
    return !!this.url;
  }
}
