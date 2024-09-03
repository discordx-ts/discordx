import type { Track } from "@discordx/music";
import type { PartialGroupDMChannel, TextBasedChannel, User } from "discord.js";

export interface MyTrack extends Track {
  duration: number;
  thumbnail?: string;
  title: string;
  user: User;
}

export type TrackChannel = Exclude<TextBasedChannel, PartialGroupDMChannel>;
