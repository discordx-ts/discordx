export enum LoadType {
  LOAD_FAILED = "LOAD_FAILED",
  NO_MATCHES = "NO_MATCHES",
  PLAYLIST_LOADED = "PLAYLIST_LOADED",
  SEARCH_RESULT = "SEARCH_RESULT",
  TRACK_LOADED = "TRACK_LOADED",
}

export interface TrackResponse {
  loadType: LoadType;
  playlistInfo: PlaylistInfo;
  tracks: Track[];
}

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
