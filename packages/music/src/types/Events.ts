import { StageChannel, VoiceChannel } from "discord.js";
import { Track } from "..";

export interface PlayerEvents {
  onError: [error: Error, track: Track];
  onFinish: [track: Track];
  onFinishPlayback: [];
  onJoin: [channel: VoiceChannel | StageChannel];
  onLeave: [];
  onLoop: [track: Track];
  onLoopDisabled: [];
  onLoopEnabled: [];
  onMix: [tracks: Track[]];
  onPause: [];
  onRepeat: [track: Track];
  onRepeatDisabled: [];
  onRepeatEnabled: [];
  onResume: [];
  onSeek: [track: Track, time: number];
  onSkip: [track: Track];
  onStart: [track: Track];
  onTrackAdd: [tracks: Track[]];
  onVolumeUpdate: [volume: number];
}

export type PlayerEventArgOf<K extends keyof PlayerEvents> = PlayerEvents[K];
