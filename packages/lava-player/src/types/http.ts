export enum LoadType {
  LOAD_FAILED = "LOAD_FAILED",
  NO_MATCHES = "NO_MATCHES",
  PLAYLIST_LOADED = "PLAYLIST_LOADED",
  SEARCH_RESULT = "SEARCH_RESULT",
  TRACK_LOADED = "TRACK_LOADED",
}

export interface TrackResponseTypeBase {
  playlistInfo: PlaylistInfo;
  tracks: Track[];
}

export interface TrackResponseTypeCommon extends TrackResponseTypeBase {
  loadType: Exclude<LoadType, LoadType.LOAD_FAILED>;
}

export interface TrackResponseTypeError extends TrackResponseTypeBase {
  exception: {
    message: string;
    severity: string;
  };
  loadType: LoadType.LOAD_FAILED;
}

export type TrackResponse = TrackResponseTypeCommon | TrackResponseTypeError;

export interface PlaylistInfo {
  name?: string;
  selectedTrack?: number;
}

export interface TrackInfo {
  author: string;
  identifier: string;
  isSeekable: boolean;
  isStream: boolean;
  length: number;
  position: number;
  title: string;
  uri: string;
}

export interface Track {
  info: TrackInfo;
  track: string;
}
