/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import type { Track } from "../index.js";

export enum PlayerStatus {
  INSTANTIATED,
  PLAYING,
  PAUSED,
  ENDED,
  ERRORED,
  STUCK,
  UNKNOWN,
}

/**
 * There are 15 bands (0-14) that can be changed. "gain" is the multiplier for the given band. The default value is 0.
 * Valid values range from -0.25 to 1.0, where -0.25 means the given band is completely muted, and 0.25 means it is doubled.
 * Modifying the gain could also change the volume of the output.
 */
export interface Equalizer {
  /**
   * The band (0 to 14)
   */
  band: number;
  /**
   * The gain (-0.25 to 1.0)
   */
  gain: number;
}

/**
 * Uses equalization to eliminate part of a band, usually targeting vocals.
 */
export interface Karaoke {
  /**
   * The filter band (in Hz)
   */
  filterBand?: number;
  /**
   * The filter width
   */
  filterWidth?: number;
  /**
   * The level (0 to 1.0 where 0.0 is no effect and 1.0 is full effect)
   */
  level?: number;
  /**
   * The mono level (0 to 1.0 where 0.0 is no effect and 1.0 is full effect)
   */
  monoLevel?: number;
}

/**
 * Changes the speed, pitch, and rate. All default to 1.0.
 */
export interface Timescale {
  /**
   * The pitch 0.0 ≤ x
   */
  pitch?: number;
  /**
   * The rate 0.0 ≤ x
   */
  rate?: number;
  /**
   * The playback speed 0.0 ≤ x
   */
  speed?: number;
}

/**
 * Uses amplification to create a shuddering effect, where the volume quickly oscillates.
 * Demo: https://en.wikipedia.org/wiki/File:Fuse_Electronics_Tremolo_MK-III_Quick_Demo.ogv
 */
export interface Tremolo {
  /**
   * The tremolo depth 0.0 < x ≤ 1.0
   */
  depth?: number;
  /**
   * The frequency 0.0 < x
   */
  frequency?: number;
}

/**
 * Similar to tremolo. While tremolo oscillates the volume, vibrato oscillates the pitch.
 */
export interface Vibrato {
  /**
   * The vibrato depth 0.0 < x ≤ 1.0
   */
  depth?: number;
  /**
   * The frequency 0.0 < x ≤ 14.0
   */
  frequency?: number;
}

/**
 * Rotates the sound around the stereo channels/user headphones (aka Audio Panning).
 * It can produce an effect similar to https://youtu.be/QB9EB8mTKcc (without the reverb).
 */
export interface Rotation {
  /**
   * The frequency of the audio rotating around the listener in Hz. 0.2 is similar to the example video above
   */
  rotationHz?: number;
}

/**
 * Distortion effect. It can generate some pretty unique audio effects.
 */
export interface Distortion {
  /**
   * The cos offset
   */
  cosOffset?: number;
  /**
   * The cos scale
   */
  cosScale?: number;
  /**
   * The offset
   */
  offset?: number;
  /**
   * The scale
   */
  scale?: number;
  /**
   * The sin off set
   */
  sinOffset?: number;
  /**
   * The sin scale
   */
  sinScale?: number;
  /**
   * The tan offset
   */
  tanOffset?: number;
  /**
   * The tan scale
   */
  tanScale?: number;
}

/**
 * Mixes both channels (left and right), with a configurable factor on how much each channel affects the other.
 * With the defaults, both channels are kept independent of each other. Setting all factors to 0.5 means both channels get the same audio.
 */
export interface ChannelMix {
  /**
   * The left to left channel mix factor (0.0 ≤ x ≤ 1.0)
   */
  leftToLeft?: number;
  /**
   * The left to right channel mix factor (0.0 ≤ x ≤ 1.0)
   */
  leftToRight?: number;
  /**
   * The right to left channel mix factor (0.0 ≤ x ≤ 1.0)
   */
  rightToLeft?: number;
  /**
   * The right to right channel mix factor (0.0 ≤ x ≤ 1.0)
   */
  rightToRight?: number;
}

/**
 * Higher frequencies get suppressed, while lower frequencies pass through this filter, thus the name low pass.
 * Any smoothing values equal to or less than 1.0 will disable the filter.
 */
export interface LowPass {
  /**
   * The smoothing factor (1.0 < x)
   */
  smoothing?: number;
}

export interface PlayerFilters {
  /**
   * Mixes both channels (left and right)
   */
  channelMix?: ChannelMix;
  /**
   * Distorts the audio
   */
  distortion?: Distortion;
  /**
   * Adjusts 15 different bands
   */
  equalizer?: Equalizer[];
  /**
   * Eliminates part of a band, usually targeting vocals
   */
  karaoke?: Karaoke;
  /**
   * Filters higher frequencies
   */
  lowPass?: LowPass;
  /**
   * Filter plugin configurations
   *
   * Plugins can add their own filters. The key is the name of the plugin, and the value is the configuration for that plugin.
   * The configuration is plugin specific. See Plugins for more plugin information.
   */
  pluginFilters?: Record<string, any>;
  /**
   * Rotates the audio around the stereo channels/user headphones (aka Audio Panning)
   */
  rotation?: Rotation;
  /**
   * Changes the speed, pitch, and rate
   */
  timescale?: Timescale;
  /**
   * Creates a shuddering effect, where the volume quickly oscillates
   */
  tremolo?: Tremolo;
  /**
   * Creates a shuddering effect, where the pitch quickly oscillates
   */
  vibrato?: Vibrato;
  /**
   * Adjusts the player volume from 0.0 to 5.0, where 1.0 is 100%. Values >1.0 may cause clipping
   */
  volume?: number;
}

export interface PlayerState {
  /**
   * Whether Lavalink is connected to the voice gateway
   */
  connected: boolean;
  /**
   * The ping of the node to the Discord voice server in milliseconds (-1 if not connected)
   */
  ping: number;
  /**
   * The position of the track in milliseconds
   */
  position: number;
  /**
   * Unix timestamp in milliseconds
   */
  time: number;
}

export interface PlayerVoiceState {
  /**
   * The Discord voice endpoint to connect to
   */
  endpoint: string;
  /**
   * The Discord voice session id to authenticate with
   */
  sessionId: string;
  /**
   * The Discord voice token to authenticate with
   */
  token: string;
}

export interface GetPlayer {
  /**
   * The filters used by the player
   */
  filters: PlayerFilters;
  /**
   * The guild id of the player
   */
  guildId: string;
  /**
   * Whether the player is paused
   */
  paused: boolean;
  /**
   * The state of the player
   */
  state: PlayerState;
  /**
   * The currently playing track
   */
  track: Track | null;
  /**
   * The voice state of the player
   */
  voice: PlayerVoiceState;
  /**
   * The volume of the player, range 0-1000, in percentage
   */
  volume: number;
}

export interface UpdateTrack {
  /**
   * The base64 encoded track to play. null stops the current track
   */
  encoded?: string | null;
  /**
   * The identifier of the track to play
   */
  identifier?: string;
  /**
   * Additional track data to be sent back in the Track Object
   */
  userData?: any;
}

export interface UpdatePlayer {
  /**
   * The track end time in milliseconds (must be > 0). null resets this if it was set previously
   */
  endTime?: number | null;
  /**
   * The new filters to apply. This will override all previously applied filters
   */
  filters?: PlayerFilters;
  /**
   * Whether the player is paused
   */
  paused?: boolean;
  /**
   * The track position in milliseconds
   */
  position?: number;
  /**
   * The currently playing track
   */
  track?: UpdateTrack;
  /**
   * Information required for connecting to Discord
   */
  voice?: PlayerVoiceState;
  /**
   * The player volume, in percentage, from 0 to 1000
   */
  volume?: number;
}
