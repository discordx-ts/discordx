import type { AudioNodeEventPayload } from "./audio-node.js";

export enum ParentProcessEvent {
  AudioNodeEvent = "AUDIO_NODE_EVENT",
  ConnectionDestroy = "CONNECTION_DESTROY",
  VoiceStateUpdate = "VOICE_STATE_UPDATE",
}

export interface VoiceStateUpdateDataPayload {
  data: any;
  op: ParentProcessEvent.VoiceStateUpdate;
}

export interface ConnectionDestroyDataPayload {
  data: any;
  op: ParentProcessEvent.ConnectionDestroy;
}

export interface NodeAudioDataPayload {
  channelId: string | null;
  data: AudioNodeEventPayload;
  guildId: string;
  op: ParentProcessEvent.AudioNodeEvent;
}

export type ParentProcessDataPayload =
  | VoiceStateUpdateDataPayload
  | ConnectionDestroyDataPayload
  | NodeAudioDataPayload;
