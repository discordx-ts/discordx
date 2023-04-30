import type { WorkerOp } from "./enum.js";

export interface WorkerPayloadDisconnect {
  d: {
    guildId: string;
  };
  op: WorkerOp.Disconnect;
}

export interface WorkerPayloadDisconnectAll {
  d: undefined;
  op: WorkerOp.DisconnectAll;
}

export interface WorkerPayloadJoin {
  d: SubscriptionPayload;
  op: WorkerOp.Join;
}

export interface WorkerPayloadOnVoiceServerUpdate {
  d: any;
  op: WorkerOp.OnVoiceServerUpdate;
}

export interface WorkerPayloadOnVoiceUpdate {
  d: any;
  op: WorkerOp.OnVoiceStateUpdate;
}

export interface WorkerPayloadPlay {
  d: {
    guildId: string;
    payload: NodePlayerOptions;
  };
  op: WorkerOp.Play;
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
