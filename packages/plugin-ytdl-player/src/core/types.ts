import type { Track } from "@discordx/music";
import type { User } from "discord.js";

export interface MyTrack extends Track {
  duration: number;
  thumbnail?: string;
  title: string;
  user: User;
}
