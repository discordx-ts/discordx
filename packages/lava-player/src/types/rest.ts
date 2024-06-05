/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

export interface TrackInfo {
  /**
   * The track artwork url
   */
  artworkUrl?: string;
  /**
   * The track author
   */
  author: string;
  /**
   * The track identifier
   */
  identifier: string;
  /**
   * Whether the track is seekable
   */
  isSeekable: boolean;
  /**
   * Whether the track is a stream
   */
  isStream: boolean;
  /**
   * The track ISRC
   */
  isrc?: string;
  /**
   * The track length in milliseconds
   */
  length: number;
  /**
   * The track position in milliseconds
   */
  position: number;
  /**
   * The track source name
   */
  sourceName: string;
  /**
   * The track title
   */
  title: string;
  /**
   * The track uri
   */
  uri?: string;
}

export interface Track {
  /**
   * The base64 encoded track data
   */
  encoded: string | null;
  /**
   * Info about the track
   */
  info: TrackInfo;
  /**
   * Additional track info provided by plugins
   */
  pluginInfo: any;
  /**
   * Additional track data provided via the Update Player endpoint
   */
  userData: any;
}

export interface PlaylistInfo {
  /**
   * The name of the playlist
   */
  name: string;

  /**
   * The selected track of the playlist (-1 if no track is selected)
   */
  selectedTrack: number;
}

export interface PlaylistResponseData {
  /**
   * The info of the playlist
   */
  info: PlaylistInfo;
  /**
   * Addition playlist info provided by plugins
   */
  pluginInfo: any;
  /**
   * The tracks of the playlist
   */
  tracks: Track[];
}

export enum ExceptionSeverity {
  /**
   * The cause is known and expected, indicates that there is nothing wrong with the library itself
   */
  COMMON = "common",
  /**
   * The probable cause is an issue with the library or there is no way to tell what the cause might be. This is the default level and other levels are used in cases where the thrower has more in-depth knowledge about the error
   */
  FAULT = "fault",
  /**
   * The cause might not be exactly known, but is possibly caused by outside factors. For example when an outside service responds in a format that we do not expect
   */
  SUSPICIOUS = "suspicious",
}

export interface Exception {
  /**
   * The cause of the exception
   */
  cause: string;
  /**
   * The message of the exception
   */
  message?: string;
  /**
   * The severity of the exception
   */
  severity: ExceptionSeverity;
}

export enum LoadType {
  /**
   * There has been no matches for your identifier
   */
  EMPTY = "empty",
  /**
   * Loading has failed with an error
   */
  ERROR = "error",
  /**
   * A playlist has been loaded
   */
  PLAYLIST = "playlist",
  /**
   * A search result has been loaded
   */
  SEARCH = "search",
  /**
   * A track has been loaded
   */
  TRACK = "track",
}

export interface TrackResponseTypeTrack {
  data: Track;
  loadType: LoadType.TRACK;
}

export interface TrackResponseTypePlaylist {
  data: PlaylistResponseData;
  loadType: LoadType.PLAYLIST;
}

export interface TrackResponseTypeSearch {
  data: Track[];
  loadType: LoadType.SEARCH;
}

export interface TrackResponseTypeEmpty {
  data: null;
  loadType: LoadType.EMPTY;
}

export interface TrackResponseTypeError {
  data: Exception;
  loadType: LoadType.ERROR;
}

export type TrackResponse =
  | TrackResponseTypeTrack
  | TrackResponseTypePlaylist
  | TrackResponseTypeSearch
  | TrackResponseTypeEmpty
  | TrackResponseTypeError;
