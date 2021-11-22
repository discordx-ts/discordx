export enum Status {
  INSTANTIATED,
  PLAYING,
  PAUSED,
  ENDED,
  ERRORED,
  STUCK,
  UNKNOWN,
}

export enum EventType {
  TRACK_END = "TrackEndEvent",
  TRACK_EXCEPTION = "TrackExceptionEvent",
  TRACK_START = "TrackStartEvent",
  TRACK_STUCK = "TrackStuckEvent",
  WEBSOCKET_CLOSED = "WebSocketClosedEvent",
}

export interface PlayerOptions {
  end?: number;
  noReplace?: boolean;
  pause?: boolean;
  start?: number;
}

export interface FilterOptions {
  distortion?: DistortionOptions;
  equalizer?: EqualizerBand[];
  karaoke?: KaraokeOptions;
  rotation?: RotationOptions;
  timescale?: TimescaleOptions;
  tremolo?: FrequencyDepthOptions;
  vibrato?: FrequencyDepthOptions;
  volume?: number;
}

export interface RotationOptions {
  rotationHz?: number;
}

export interface DistortionOptions {
  cosOffset?: number;
  cosScale?: number;
  offset?: number;
  scale?: number;
  sinOffset?: number;
  sinScale?: number;
  tanOffset?: number;
  tanScale?: number;
}

export interface KaraokeOptions {
  filterBand?: number;
  filterWidth?: number;
  level?: number;
  monoLevel?: number;
}

export interface TimescaleOptions {
  pitch?: number;
  rate?: number;
  speed?: number;
}

export interface FrequencyDepthOptions {
  depth?: number;
  frequency?: number;
}

export interface EqualizerBand {
  band: number;
  gain: number;
}

export interface JoinOptions {
  deaf?: boolean;
  mute?: boolean;
}
