/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import backoff from "backoff";
import type { IncomingMessage } from "http";
import WebSocket from "ws";

import type { BaseNode } from "../base/Node.js";

interface Sendable {
  data: Buffer | string;
  reject: (e: Error) => void;
  resolve: () => void;
}

interface Headers {
  Authorization: string;
  "Client-Name": string;
  "Num-Shards": number; // TODO: remove in next major version
  "Resume-Key"?: string;
  "User-Id": string;
}

export interface ConnectionOptions extends WebSocket.ClientOptions {
  resumeKey?: string;
  resumeTimeout?: number;
}

export class Connection<T extends BaseNode = BaseNode> {
  public readonly node: T;
  public url: string;
  public options: ConnectionOptions;
  public resumeKey?: string;

  public ws!: WebSocket;
  public reconnectTimeout = 100; // TODO: remove in next major version

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
        pk = JSON.parse(d.toString());
      } catch (e) {
        this.node.emit("error", e);
        return;
      }

      if (pk.guildId && this.node.players.has(pk.guildId)) {
        this.node.players.get(pk.guildId).emit(pk.op, pk);
      }
      this.node.emit(pk.op, pk);
    },
    open: () => {
      this.backoff.reset();
      this.node.emit("open");
      this._flush()
        .then(() =>
          this.configureResuming(
            this.options.resumeTimeout,
            this.options.resumeKey,
          ),
        )
        .catch((e) => this.node.emit("error", e));
    },
    upgrade: (req: IncomingMessage) => this.node.emit("upgrade", req),
  };

  private _queue: Array<Sendable> = [];

  constructor(node: T, url: string, options: ConnectionOptions = {}) {
    this.node = node;
    this.url = url;
    this.options = options;
    this.resumeKey = options.resumeKey;

    this.backoff = backoff.exponential();
    this._send = this._send.bind(this);
    this.connect();
  }

  public get backoff(): backoff.Backoff {
    return this._backoff;
  }

  public set backoff(b: backoff.Backoff) {
    b.on("ready", (number, delay) => {
      this.reconnectTimeout = delay;
      this.connect();
    });
    b.on("backoff", (number, delay) => (this.reconnectTimeout = delay));

    if (this._backoff) {
      this._backoff.removeAllListeners();
    }

    this._backoff = b;
  }

  public connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }

    const headers: Headers = {
      Authorization: this.node.password,
      "Client-Name": "@discordx/lava-player",
      "Num-Shards": this.node.shardCount || 1,
      "User-Id": this.node.userId,
    };

    if (this.resumeKey) {
      headers["Resume-Key"] = this.resumeKey;
    }

    this.ws = new WebSocket(this.url, Object.assign({ headers }, this.options));
    this._registerWSEventListeners();
  }

  public configureResuming(
    timeout = 60,
    key: string = Math.random().toString(36),
  ): Promise<void> {
    this.resumeKey = key;

    return this.send({
      key,
      op: "configureResuming",
      timeout,
    });
  }

  public send(d: object): Promise<void> {
    return new Promise((resolve, reject) => {
      const encoded = JSON.stringify(d);
      const send = { data: encoded, reject, resolve };

      if (this.ws.readyState === WebSocket.OPEN) {
        this._send(send);
      } else {
        this._queue.push(send);
      }
    });
  }

  public close(code?: number, data?: string): Promise<void> {
    if (!this.ws) {
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

  private _reconnect() {
    if (this.ws.readyState === WebSocket.CLOSED) {
      this.backoff.backoff();
    }
  }

  private _registerWSEventListeners() {
    for (const [event, listener] of Object.entries(this._listeners)) {
      if (!this.ws.listeners(event).includes(listener)) {
        this.ws.on(event, listener);
      }
    }
  }

  private async _flush() {
    await Promise.all(this._queue.map((queue) => this._send(queue)));
    this._queue = [];
  }

  private _send({ resolve, reject, data }: Sendable) {
    this.ws.send(data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  }
}
