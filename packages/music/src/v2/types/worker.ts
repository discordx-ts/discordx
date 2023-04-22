import type { WorkerOp } from "./enum.js";

export interface WorkerPayloadDisconnect {
  d: {
    guildId: string;
  };
  op: WorkerOp.disconnect;
}

export interface WorkerPayloadDisconnectAll {
  d: undefined;
  op: WorkerOp.disconnectAll;
}

export interface WorkerPayloadJoin {
  d: SubscriptionPayload;
  op: WorkerOp.join;
}

export interface WorkerPayloadOnVoiceServerUpdate {
  d: any;
  op: WorkerOp.onVoiceServerUpdate;
}

export interface WorkerPayloadOnVoiceUpdate {
  d: any;
  op: WorkerOp.onVoiceStateUpdate;
}

export interface WorkerPayloadPlay {
  d: {
    guildId: string;
    payload: NodePlayerOptions;
  };
  op: WorkerOp.play;
}

export type WorkerPayload =
  | WorkerPayloadDisconnect
  | WorkerPayloadDisconnectAll
  | WorkerPayloadJoin
  | WorkerPayloadOnVoiceServerUpdate
  | WorkerPayloadOnVoiceUpdate
  | WorkerPayloadPlay;

export interface SubscriptionPayload {
  channelId: string;
  deafen?: boolean;
  guildId: string;
}

export interface NodePlayerOptions {
  initialVolume?: number;
  metadata?: unknown;
  query: string;
}
