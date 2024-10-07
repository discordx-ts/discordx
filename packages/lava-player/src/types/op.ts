/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import type { PlayerState } from "../index.js";
import type { Exception, Track } from "./rest.js";

export enum OPType {
  /**
   * Dispatched when player or voice events occur
   */
  EVENT = "event",
  /**
   * Dispatched every x seconds with the latest player state
   */
  PLAYER_UPDATE = "playerUpdate",
  /**
   * Dispatched when you successfully connect to the Lavalink node
   */
  READY = "ready",
  /**
   * Dispatched when the node sends stats once per minute
   */
  STATS = "stats",
}

export enum EventType {
  /**
   * Dispatched when a track ends
   */
  TrackEndEvent = "TrackEndEvent",
  /**
   * Dispatched when a track throws an exception
   */
  TrackExceptionEvent = "TrackExceptionEvent",
  /**
   * Dispatched when a track starts playing
   */
  TrackStartEvent = "TrackStartEvent",
  /**
   * Dispatched when a track gets stuck while playing
   */
  TrackStuckEvent = "TrackStuckEvent",
  /**
   * Dispatched when the websocket connection to Discord voice servers is closed
   */
  WebSocketClosedEvent = "WebSocketClosedEvent",
}

export interface EventBase {
  /**
   * The guild id
   */
  guildId: string;
  /**
   * Type of OP
   */
  op: OPType.EVENT;
  /**
   * The type of event
   */
  type: EventType;
}

export enum TrackEndReason {
  /**
   * The track was cleaned up
   *
   * May start next: false
   */
  CLEANUP = "cleanup",
  /**
   * The track finished playing
   *
   * May start next: true
   */
  FINISHED = "finished",
  /**
   * The track failed to load
   *
   * May start next: true
   */
  LOAD_FAILED = "loadFailed",
  /**
   * The track was replaced
   *
   * May start next: false
   */
  REPLACED = "replaced",
  /**
   * The track was stopped
   *
   * May start next: false
   */
  STOPPED = "stopped",
}

export interface TrackEndEvent extends EventBase {
  /**
   * The reason the track ended
   */
  reason: TrackEndReason;
  /**
   * The track that ended playing
   */
  track: Track;
  /**
   * The type of event
   */
  type: EventType.TrackEndEvent;
}

export interface TrackExceptionEvent extends EventBase {
  /**
   * The occurred exception
   */
  exception: Exception;
  /**
   * The track that threw the exception
   */
  track: Track;
  /**
   * The type of event
   */
  type: EventType.TrackExceptionEvent;
}

export interface TrackStartEvent extends EventBase {
  /**
   * The track that threw the exception
   */
  track: Track;
  /**
   * The type of event
   */
  type: EventType.TrackStartEvent;
}

export interface TrackStuckEvent extends EventBase {
  /**
   * The threshold in milliseconds that was exceeded
   */
  thresholdMs: number;
  /**
   * The track that threw the exception
   */
  track: Track;
  /**
   * The type of event
   */
  type: EventType.TrackStuckEvent;
}

export interface WebSocketClosedEvent extends EventBase {
  /**
   * Whether the connection was closed by Discord
   */
  byRemote: boolean;
  /**
   * The Discord close [event code](https://discord.com/developers/docs/topics/opcodes-and-status-codes#voice-voice-close-event-codes)
   */
  code: number;
  /**
   * The close reason
   */
  reason: string;
  /**
   * The type of event
   */
  type: EventType.WebSocketClosedEvent;
}

export type OPEvent =
  | TrackEndEvent
  | TrackExceptionEvent
  | TrackStartEvent
  | TrackStuckEvent
  | WebSocketClosedEvent;

export interface OPReady {
  /**
   * The type of OP
   */
  op: OPType.READY;
  /**
   * Whether this session was resumed
   */
  resumed: boolean;
  /**
   * The Lavalink session id of this connection. Not to be confused with a Discord voice session id
   */
  sessionId: string;
}

export interface CPUStats {
  cores: number;
  lavalinkLoad: number;
  systemLoad: number;
}

export interface MemoryStats {
  allocated: number;
  free: number;
  reservable: number;
  used: number;
}

export interface OPStats {
  cpu: CPUStats;
  memory: MemoryStats;
  op: OPType.STATS;
  players: number;
  playingPlayers: number;
  uptime: number;
}

export interface OPPlayerUpdate {
  guildId: string;
  op: OPType.PLAYER_UPDATE;
  state: PlayerState;
}

export type OpResponse = OPEvent | OPReady | OPStats | OPPlayerUpdate;
