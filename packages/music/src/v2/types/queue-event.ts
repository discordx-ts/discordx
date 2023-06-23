import type { AudioNodeEventPayload } from "./audio-node.js";

export enum QueueEvent {
  AudioNodeEvent = "AUDIO_NODE_EVENT",
}

export interface AudioPlayerStateChangePayload {
  channelId: string | null;
  data: AudioNodeEventPayload;
  guildId: string;
  type: QueueEvent.AudioNodeEvent;
}

export type QueuePayload = AudioPlayerStateChangePayload;
