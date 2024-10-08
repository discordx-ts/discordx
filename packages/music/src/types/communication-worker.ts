/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
export enum WorkerOperation {
  Disconnect = "DISCONNECT",
  DisconnectAll = "DISCONNECT_ALL",
  Join = "JOIN",
  OnVoiceServerUpdate = "ON_VOICE_SERVER_UPDATE",
  OnVoiceStateUpdate = "ON_VOICE_STATE_UPDATE",
  Pause = "PAUSE",
  PingPlaybackInfo = "PING_PLAYBACK_INFO",
  Play = "PLAY",
  Resume = "RESUME",
  SetVolume = "SET_VOLUME",
  Stop = "STOP",
}

export interface GuildData {
  guildId: string;
}

export interface DisconnectPayload {
  data: GuildData;
  op: WorkerOperation.Disconnect;
}

export interface DisconnectAllPayload {
  data?: undefined;
  op: WorkerOperation.DisconnectAll;
}

export interface JoinData {
  channelId: string;
  deafen?: boolean;
  group?: string;
  guildId: string;
}

export interface JoinPayload {
  data: JoinData;
  op: WorkerOperation.Join;
}

export interface VoiceServerUpdatePayload {
  data: any;
  op: WorkerOperation.OnVoiceServerUpdate;
}

export interface VoiceUpdatePayload {
  data: any;
  op: WorkerOperation.OnVoiceStateUpdate;
}

export interface NodePlayerOptions {
  initialVolume?: number;
  metadata?: unknown;
  query: string;
  seek?: number;
}

export interface PlayPayload {
  data: PlayData;
  op: WorkerOperation.Play;
}

export interface PlayData {
  guildId: string;
  payload: NodePlayerOptions;
}

export interface SetVolumePayload {
  data: SetVolumeData;
  op: WorkerOperation.SetVolume;
}

export interface SetVolumeData {
  guildId: string;
  volume: number;
}

export interface PingPlaybackInfoPayload {
  data: GuildData;
  op: WorkerOperation.PingPlaybackInfo;
}

export interface PausePayload {
  data: GuildData;
  op: WorkerOperation.Pause | WorkerOperation.Resume;
}

export interface StopPayload {
  data: GuildData;
  op: WorkerOperation.Stop;
}

export type WorkerDataPayload =
  | DisconnectPayload
  | DisconnectAllPayload
  | JoinPayload
  | VoiceServerUpdatePayload
  | VoiceUpdatePayload
  | PlayPayload
  | SetVolumePayload
  | PingPlaybackInfoPayload
  | PausePayload
  | StopPayload;
