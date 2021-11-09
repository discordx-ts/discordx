import { Queue, Track } from "../index.js";
import { StageChannel, VoiceChannel } from "discord.js";

export interface PlayerEvents<T extends Queue = Queue> {
  onError: (args: [queue: T, error: Error, track: Track]) => void;
  onFinish: (args: [queue: T, track: Track]) => void;
  onFinishPlayback: (args: [queue: T]) => void;
  onJoin: (args: [queue: T, channel: VoiceChannel | StageChannel]) => void;
  onLeave: (args: [queue: T]) => void;
  onLoop: (args: [queue: T, track: Track]) => void;
  onLoopDisabled: (args: [queue: T]) => void;
  onLoopEnabled: (args: [queue: T]) => void;
  onMix: (args: [queue: T, trackargs: Track[]]) => void;
  onPause: (args: [queue: T]) => void;
  onRepeat: (args: [queue: T, track: Track]) => void;
  onRepeatDisabled: (args: [queue: T]) => void;
  onRepeatEnabled: (args: [queue: T]) => void;
  onResume: (args: [queue: T]) => void;
  onSeek: (args: [queue: T, track: Track, time: number]) => void;
  onSkip: (args: [queue: T, track: Track]) => void;
  onStart: ([queue, track]: [queue: T, track: Track]) => void;
  onTrackAdd: (args: [queue: T, trackargs: Track[]]) => void;
  onVolumeUpdate: (args: [queue: T, volume: number]) => void;
}

export type PlayerEventArgOf<
  Q extends Queue,
  E extends keyof PlayerEvents<Q>
> = PlayerEvents<Q>[E];
