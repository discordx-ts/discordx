import type { AudioResource } from "@discordjs/voice";
import type internal from "node:stream";

import type { CustomTrack, YoutubeTrack } from "./index.js";

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
