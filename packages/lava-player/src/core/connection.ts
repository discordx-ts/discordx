/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import backoff from "backoff";
import type { IncomingMessage } from "http";
import WebSocket from "ws";

import type { BaseNode } from "../base/base-node.js";

/**
 * Interface representing HTTP headers.
 */
interface Headers {
  Authorization: string;
  "Client-Name": string;
  "Session-Id"?: string;
  "User-Id": string;
}

/**
 * Interface representing connection options.
 */
export interface ConnectionOptions extends WebSocket.ClientOptions {
  sessionId?: string;
}

/**
 * Class representing a WebSocket connection.
 * @template T - The type of node.
 */
export class Connection<T extends BaseNode = BaseNode> {
  public readonly node: T;
  public url: string;
  public options: ConnectionOptions;
  public sessionId?: string;

  public ws!: WebSocket;
  private _backoff!: backoff.Backoff;

  private _listeners = {
    close: (code: number, reason: string) => {
      this.node.emit("close", code, reason);
      this._reconnect();
    },
    error: (err: any) => {
      this.node.emit("error", err);
      this._reconnect();
    },
    message: (d: WebSocket.Data) => {
      if (Array.isArray(d)) {
        d = Buffer.concat(d);
      } else if (d instanceof ArrayBuffer) {
        d = Buffer.from(d);
      }

      let pk: any;
      try {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        pk = JSON.parse(d.toString());
      } catch (e) {
        this.node.emit("error", e);
        return;
      }

      if (pk.guildId && this.node.guildPlayerStore.has(pk.guildId)) {
        this.node.guildPlayerStore.get(pk.guildId).emit(pk.op, pk);
      }
      this.node.emit(pk.op, pk);
    },
    open: () => {
      this.backoff.reset();
      this.node.emit("open");
    },
    upgrade: (req: IncomingMessage) => this.node.emit("upgrade", req),
  };

  /**
   * Constructor for the Connection class.
   * @param node - The node instance.
   * @param url - The WebSocket URL.
   * @param options - The connection options.
   */
  constructor(node: T, url: string, options: ConnectionOptions = {}) {
    this.node = node;
    this.url = url;
    this.options = options;
    this.sessionId = options.sessionId;

    this.backoff = backoff.exponential();
    this.connect();
  }

  /**
   * Getter for the backoff property.
   */
  public get backoff(): backoff.Backoff {
    return this._backoff;
  }

  /**
   * Setter for the backoff property.
   */
  public set backoff(b: backoff.Backoff) {
    b.on("ready", () => {
      this.connect();
    });

    if (typeof this._backoff !== "undefined") {
      this._backoff.removeAllListeners();
    }

    this._backoff = b;
  }

  /**
   * Connects to the WebSocket server.
   */
  public connect(): void {
    if (
      typeof this.ws !== "undefined" &&
      this.ws.readyState === WebSocket.OPEN
    ) {
      this.ws.close();
    }

    const headers: Headers = {
      Authorization: this.node.password,
      "Client-Name": "@discordx/lava-player",
      "User-Id": this.node.userId,
    };

    if (this.sessionId) {
      headers["Session-Id"] = this.sessionId;
    }

    this.ws = new WebSocket(this.url, Object.assign({ headers }, this.options));
    this._registerWSEventListeners();
  }

  /**
   * Closes the WebSocket connection.
   * @param code - The close code.
   * @param data - The close data.
   */
  public close(code?: number, data?: string): Promise<void> {
    if (typeof this.ws === "undefined") {
      return Promise.resolve();
    }

    this.ws.removeListener("close", this._listeners.close);
    return new Promise((resolve) => {
      this.ws.once("close", (codex: number, reason: string) => {
        this.node.emit("close", codex, reason);
        resolve();
      });

      this.ws.close(code, data);
    });
  }

  /**
   * Reconnects the WebSocket connection.
   */
  private _reconnect() {
    if (this.ws.readyState === WebSocket.CLOSED) {
      this.backoff.backoff();
    }
  }

  /**
   * Registers WebSocket event listeners.
   */
  private _registerWSEventListeners() {
    for (const [event, listener] of Object.entries(this._listeners)) {
      if (!this.ws.listeners(event).includes(listener)) {
        this.ws.on(event, listener);
      }
    }
  }
}
