export enum WorkerOperation {
  Disconnect = "DISCONNECT",
  DisconnectAll = "DISCONNECT_ALL",
  Join = "JOIN",
  OnVoiceServerUpdate = "ON_VOICE_SERVER_UPDATE",
  OnVoiceStateUpdate = "ON_VOICE_STATE_UPDATE",
  Play = "PLAY",
  SetVolume = "SET_VOLUME",
}

export interface DisconnectPayload {
  data: {
    guildId: string;
  };
  op: WorkerOperation.Disconnect;
}

export interface DisconnectAllPayload {
  data: undefined;
  op: WorkerOperation.DisconnectAll;
}

export interface SubscriptionPayload {
  channelId: string;
  deafen?: boolean;
  guildId: string;
}

export interface JoinPayload {
  data: SubscriptionPayload;
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
}

export interface PlayPayload {
  data: {
    guildId: string;
    payload: NodePlayerOptions;
  };
  op: WorkerOperation.Play;
}

export interface SetVolumePayload {
  data: {
    guildId: string;
    volume: number;
  };
  op: WorkerOperation.SetVolume;
}

export type WorkerDataPayload =
  | DisconnectPayload
  | DisconnectAllPayload
  | JoinPayload
  | VoiceServerUpdatePayload
  | VoiceUpdatePayload
  | PlayPayload
  | SetVolumePayload;
