import type { WorkerEvent, WorkerOp } from "./enum.js";

export interface WorkerPayloadDisconnect {
  data: {
    guildId: string;
  };
  op: WorkerOp.Disconnect;
}

export interface WorkerPayloadDisconnectAll {
  data: undefined;
  op: WorkerOp.DisconnectAll;
}

export interface SubscriptionPayload {
  channelId: string;
  deafen?: boolean;
  guildId: string;
}

export interface WorkerPayloadJoin {
  data: SubscriptionPayload;
  op: WorkerOp.Join;
}

export interface WorkerPayloadOnVoiceServerUpdate {
  data: any;
  op: WorkerOp.OnVoiceServerUpdate;
}

export interface WorkerPayloadOnVoiceUpdate {
  data: any;
  op: WorkerOp.OnVoiceStateUpdate;
}

export interface NodePlayerOptions {
  initialVolume?: number;
  metadata?: unknown;
  query: string;
}

export interface WorkerPayloadPlay {
  data: {
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

export interface WorkerEventPayloadVoiceStateUpdate {
  data: any;
  op: WorkerEvent.VoiceStateUpdate;
}

export interface WorkerEventPayloadConnectionDestroy {
  data: any;
  op: WorkerEvent.ConnectionDestroy;
}

export type WorkerEventPayload =
  | WorkerEventPayloadVoiceStateUpdate
  | WorkerEventPayloadConnectionDestroy;
