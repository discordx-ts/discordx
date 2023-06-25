import type { AudioPlayerStatus } from "@discordjs/voice";

export enum AudioNodeEvent {
  Debug = "DEBUG",
  Error = "ERROR",
  PlaybackInfo = "PLAYBACK_INFO",
  StateChange = "STATE_CHANGE",
  Subscription = "SUBSCRIPTION",
  UnSubscription = "UN_SUBSCRIPTION",
}

export interface PlaybackInfoAudioNodePayload {
  ended: boolean;
  playbackDuration: number;
  playerStatus: AudioPlayerStatus;
  type: AudioNodeEvent.PlaybackInfo;
}

export interface DebugAudioNodePayload {
  message: string;
  type: AudioNodeEvent.Debug;
}

export interface StateChangeAudioNodePayload {
  newState: AudioPlayerStatus;
  oldState: AudioPlayerStatus;
  type: AudioNodeEvent.StateChange;
}

export type AudioNodeEventPayload =
  | PlaybackInfoAudioNodePayload
  | DebugAudioNodePayload
  | StateChangeAudioNodePayload;
