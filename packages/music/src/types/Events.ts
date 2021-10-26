import { Track } from "..";

export interface PlayerEvents {
  onError: [error: Error, track: Track];
  onFinish: [track: Track];
  onFinishPlayback: [];
  onLoop: [track: Track];
  onLoopDisabled: [];
  onLoopEnabled: [];
  onMix: [tracks: Track[]];
  onPause: [];
  onRepeat: [track: Track];
  onRepeatDisabled: [];
  onRepeatEnabled: [];
  onResume: [];
  onSkip: [track: Track];
  onStart: [track: Track];
  onTrackAdd: [tracks: Track[]];
  onVolumeUpdate: [volume: number];
}

export type PlayerEventArgOf<K extends keyof PlayerEvents> = PlayerEvents[K];
