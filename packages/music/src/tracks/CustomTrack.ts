import type internal from "node:stream";

import type { AudioResource, StreamType } from "@discordjs/voice";
import { createAudioResource } from "@discordjs/voice";

import type { CommonTrack } from "../index.js";
import { Track } from "./Track.js";

/**
 * Track options
 */
export interface CustomTrackItem {
  [key: string]: any;
  source: string | internal.Readable;
  streamType?: StreamType;
  title: string;
}

/**
 * Music track
 */
export class CustomTrack extends Track {
  constructor(public info: CustomTrackItem) {
    super(info.title, undefined, info.source);
    // empty constructor
  }

  /**
   * Create audio resource
   * @returns
   */
  public createAudioResource(): AudioResource<CommonTrack> {
    return createAudioResource(this.info.source, {
      inlineVolume: true,
      inputType: this.info.streamType,
      metadata: this,
    });
  }
}
