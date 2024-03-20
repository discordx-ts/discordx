/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { ConnectionOptions } from "../index.js";

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
  host?: {
    address: string;
    connectionOptions?: ConnectionOptions;
    port: number;
    rest?: {
      address: string;
      port: number;
      secure?: boolean;
    };
    secure?: boolean;
  };
  password: string;
  shardCount?: number;
  userId: string;
}
