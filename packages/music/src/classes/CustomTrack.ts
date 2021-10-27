import {
  AudioResource,
  StreamType,
  createAudioResource,
} from "@discordjs/voice";
import { CommonTrack, Player, Track } from ".";
import { GuildMember, User } from "discord.js";
import internal from "node:stream";

/**
 * Music track
 */
export class CustomTrack extends Track {
  constructor(
    public player: Player,
    public title: string,
    public source: string | internal.Readable,
    public streamType?: StreamType,
    public user?: User | GuildMember
  ) {
    super(title, undefined, source);
    // empty constructor
  }

  /**
   * return title
   * @returns
   */
  toString(): string {
    return this.title;
  }

  /**
   * Create audio resource
   * @returns
   */
  public createAudioResource(): AudioResource<CommonTrack> {
    return createAudioResource(this.source, {
      inputType: this.streamType,
      metadata: this,
    });
  }
}
