import { ConnectionOptions } from "..";

export interface VoiceStateUpdate {
  channel_id?: string;
  deaf?: boolean;
  guild_id: string;
  mute?: boolean;
  self_deaf?: boolean;
  self_mute?: boolean;
  session_id: string;
  suppress?: boolean;
  user_id: string;
}

export interface VoiceServerUpdate {
  endpoint: string;
  guild_id: string;
  token: string;
}

export interface BaseNodeOptions {
  host?: string;
  hosts?: {
    rest?: string;
    ws?: string | { options: ConnectionOptions; url: string };
  };
  password: string;
  shardCount?: number;
  userID: string;
}
