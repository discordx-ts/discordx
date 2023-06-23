import type { AudioPlayerStatus } from "@discordjs/voice";

export enum AudioNodeEvent {
  Debug = "DEBUG",
  Error = "ERROR",
  StateChange = "STATE_CHANGE",
  Subscription = "SUBSCRIPTION",
  UnSubscription = "UN_SUBSCRIPTION",
}

export interface AudioNodeEventDebug {
  message: string;
  type: AudioNodeEvent.Debug;
}

export interface AudioNodeEventStateChange {
  newState: AudioPlayerStatus;
  oldState: AudioPlayerStatus;
  type: AudioNodeEvent.StateChange;
}

export type AudioNodeEventPayload =
  | AudioNodeEventDebug
  | AudioNodeEventStateChange;
