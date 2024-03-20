/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
export enum EventType {
  TrackEndEvent = "TrackEndEvent",
  TrackExceptionEvent = "TrackExceptionEvent",
  TrackStartEvent = "TrackStartEvent",
  TrackStuckEvent = "TrackStuckEvent",
  WebSocketClosedEvent = "WebSocketClosedEvent",
}

export interface RawEventBase {
  guildId: string;
  op: "event";
}

export interface RawEventTypeTrackEndEvent extends RawEventBase {
  reason: "LOAD_FAILED" | "FINISHED" | "REPLACED";
  track: string;
  type: "TrackEndEvent";
}

export interface RawEventTypeTrackExceptionEvent extends RawEventBase {
  error: string;
  exception: {
    cause: string;
    message: string;
    severity: "COMMON";
  };
  track: string;
  type: "TrackExceptionEvent";
}

export interface RawEventTypeTrackStartEvent extends RawEventBase {
  track: string;
  type: "TrackStartEvent";
}

export interface RawEventTypeTrackStuckEvent extends RawEventBase {
  thresholdMs: number;
  track: string;
  type: "TrackStuckEvent";
}

export interface RawEventTypeWebSocketClosedEvent extends RawEventBase {
  byRemote: boolean;
  code: number;
  reason: string;
  type: "WebSocketClosedEvent";
}

export type RawEventType =
  | RawEventTypeTrackEndEvent
  | RawEventTypeTrackExceptionEvent
  | RawEventTypeTrackStartEvent
  | RawEventTypeTrackStuckEvent
  | RawEventTypeWebSocketClosedEvent;

export interface WsRawEventStats {
  cpu: {
    cores: number;
    lavalinkLoad: number;
    systemLoad: number;
  };
  memory: {
    allocated: number;
    free: number;
    reservable: number;
    used: number;
  };
  op: "stats";
  players: number;
  playingPlayers: number;
  uptime: number;
}

export interface WsRawEventPlayerUpdate {
  guildId: string;
  op: "playerUpdate";
  state: { connected: boolean; position?: number; time: number };
}

export type WRawEventType =
  | RawEventType
  | WsRawEventStats
  | WsRawEventPlayerUpdate;
