import type { IGuild } from "../index.js";

export type ReactionOptions = {
  aliases?: string[];
  botIds?: string[];
  description?: string;
  directMessage?: boolean;
  guilds?: IGuild[];
  partial?: boolean;
  remove?: boolean;
};
