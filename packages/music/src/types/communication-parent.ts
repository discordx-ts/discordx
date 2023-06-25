import type { AudioNodeEventPayload } from "./audio-node.js";

export enum ParentProcessEvent {
  AudioNodeEvent = "AUDIO_NODE_EVENT",
  AudioNodeNotFound = "AUDIO_NODE_NOT_FOUND",
  ConnectionDestroy = "CONNECTION_DESTROY",
  VoiceStateUpdate = "VOICE_STATE_UPDATE",
}

export interface VoiceStateUpdateData {
  channelId: string;
  guildId: string;
  payload: VoiceStateUpdatePayload;
}

export interface VoiceStateUpdatePayload {
  channel_id: string;
  guild_id: string;
  self_deaf: boolean;
  self_mute: boolean;
}

export interface ConnectionDestroyData {
  channelId: string;
  guildId: string;
}

export interface NodeAudioData {
  channelId: string | null;
  guildId: string;
  payload: AudioNodeEventPayload;
}

export interface VoiceStateUpdateDataPayload {
  data: VoiceStateUpdateData;
  op: ParentProcessEvent.VoiceStateUpdate;
}

export interface ConnectionDestroyDataPayload {
  data: ConnectionDestroyData;
  op: ParentProcessEvent.ConnectionDestroy;
}

export interface NodeAudioDataPayload {
  data: NodeAudioData;
  op: ParentProcessEvent.AudioNodeEvent;
}

export interface AudioNodeNotFoundData {
  guildId: string;
}

export interface AudioNodeNotFoundDataPayload {
  data: AudioNodeNotFoundData;
  op: ParentProcessEvent.AudioNodeNotFound;
}

export type ParentProcessDataPayload =
  | VoiceStateUpdateDataPayload
  | ConnectionDestroyDataPayload
  | NodeAudioDataPayload
  | AudioNodeNotFoundDataPayload;
