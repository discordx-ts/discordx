import { Track } from "..";

export interface PlayerEvents {
  onError: [error: Error, track: Track];
  onFinish: [track: Track];
  onStart: [track: Track];
  onLoop: [track: Track];
  onFinishPlayback: [];
  onRepeat: [track: Track];
  onSkip: [track: Track];
  onPause: [];
  onResume: [];
  onTrackAdd: [tracks: Track[]];
  onLoopEnabled: [];
  onLoopDisabled: [];
  onRepeatEnabled: [];
  onRepeatDisabled: [];
  onMix: [tracks: Track[]];
  onVolumeUpdate: [volume: number];
}

export type PlayerEventArgOf<K extends keyof PlayerEvents> = PlayerEvents[K];
