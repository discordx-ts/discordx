/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { EventEmitter } from "events";
import WebSocket from "ws";

import { Connection } from "../core/connection.js";
import PlayerStore from "../core/player-store.js";
import { Rest } from "../core/rest.js";
import type {
  BaseNodeOptions,
  OPReady,
  VoiceServerUpdate,
  VoiceStateUpdate,
} from "../types/index.js";

export abstract class BaseNode extends EventEmitter {
  public abstract send: (guildId: string, packet: any) => Promise<any>;

  public password: string;
  public userId: string;
  public sessionId: string | null = null;

  public connection: Connection;
  public players: PlayerStore<this> = new PlayerStore(this);
  public rest: Rest;

  public voiceStates: Map<string, VoiceStateUpdate> = new Map();
  public voiceServers: Map<string, VoiceServerUpdate> = new Map();

  private _expectingConnection: Set<string> = new Set();

  constructor({ password, userId, host }: BaseNodeOptions) {
    super();
    this.password = password;
    this.userId = userId;

    const restIsSecure = host?.rest?.secure ?? host?.secure ?? false;
    const restAddress = host?.rest?.address ?? host?.address ?? "localhost";
    const restPort = host?.rest?.port ?? host?.port ?? 2333;

    this.rest = new Rest(
      this,
      `${restIsSecure ? "https" : "http"}://${restAddress}:${restPort}/v4/`,
    );

    const wsIsSecure = host?.secure ?? false;
    const wsAddress = host?.address ?? "localhost";
    const wsPort = host?.port ?? 2333;

    this.connection = new Connection(
      this,
      `${wsIsSecure ? "wss" : "ws"}://${wsAddress}:${wsPort}/v4/websocket`,
      host?.connectionOptions,
    );

    this.on("ready", (d: OPReady) => {
      this.sessionId = d.sessionId;
    });
  }

  public get connected(): boolean {
    return this.connection?.ws.readyState === WebSocket.OPEN;
  }

  public voiceStateUpdate(packet: VoiceStateUpdate): Promise<boolean> {
    if (packet.user_id !== this.userId) {
      return Promise.resolve(false);
    }

    if (packet.channel_id) {
      this.voiceStates.set(packet.guild_id, packet);
      return this._tryConnection(packet.guild_id);
    } else {
      this.voiceServers.delete(packet.guild_id);
      this.voiceStates.delete(packet.guild_id);
    }

    return Promise.resolve(false);
  }

  public voiceServerUpdate(packet: VoiceServerUpdate): Promise<boolean> {
    this.voiceServers.set(packet.guild_id, packet);
    this._expectingConnection.add(packet.guild_id);
    return this._tryConnection(packet.guild_id);
  }

  public connect(): void {
    this.connection?.connect();
  }

  public disconnect(code?: number, data?: string): Promise<void> {
    if (this.connection) {
      return this.connection.close(code, data);
    }
    return Promise.resolve();
  }

  public async destroy(code?: number, data?: string): Promise<void> {
    await Promise.all(
      [...this.players.values()].map((player) => player.destroy()),
    );
    await this.disconnect(code, data);
  }

  private async _tryConnection(guildId: string): Promise<boolean> {
    const state = this.voiceStates.get(guildId);
    const server = this.voiceServers.get(guildId);
    if (!state || !server || !this._expectingConnection.has(guildId)) {
      return false;
    }

    await this.players.get(guildId).update({
      voice: {
        endpoint: server.endpoint,
        sessionId: state.session_id,
        token: server.token,
      },
    });
    this._expectingConnection.delete(guildId);
    return true;
  }
}
