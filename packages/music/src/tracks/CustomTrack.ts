import type internal from "node:stream";

import type { AudioResource, StreamType } from "@discordjs/voice";
import { createAudioResource } from "@discordjs/voice";
import type { GuildMember, User } from "discord.js";

import type { CommonTrack, Player } from "../index.js";
import { Track } from "./Track.js";

/**
 * Music track
 */
export class CustomTrack extends Track {
  constructor(
    public player: Player,
    public title: string,
    public source: string | internal.Readable,
    public duration?: number,
    public streamType?: StreamType,
    public user?: User | GuildMember
  ) {
    super(title, undefined, source);
    // empty constructor
  }

  /**
   * Create audio resource
   * @returns
   */
  public createAudioResource(): AudioResource<CommonTrack> {
    return createAudioResource(this.source, {
      inlineVolume: true,
      inputType: this.streamType,
      metadata: this,
    });
  }
}
