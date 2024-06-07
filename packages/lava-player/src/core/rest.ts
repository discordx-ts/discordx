/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { IncomingHttpHeaders, IncomingMessage } from "http";
import { request, STATUS_CODES } from "http";
import { URL } from "url";

import type { BaseNode } from "../base/base-node.js";
import {
  GetPlayer,
  RequestType,
  RoutePlannerStatus,
  Track,
  TrackResponse,
  UpdatePlayer,
} from "../types/index.js";

export class HTTPError extends Error {
  public method: string;
  public statusCode: number;
  public headers: IncomingHttpHeaders;
  public path: string;

  get statusMessage(): string | undefined {
    return STATUS_CODES[this.statusCode];
  }

  constructor(httpMessage: IncomingMessage, method: string, url: URL) {
    super(`${httpMessage.statusCode} ${STATUS_CODES[httpMessage.statusCode!]}`);

    this.statusCode = httpMessage.statusCode!;
    this.headers = httpMessage.headers;
    this.name = this.constructor.name;
    this.path = url.toString();
    this.method = method;
  }
}

export class Rest {
  public readonly node: BaseNode;
  public base: string;

  constructor(node: BaseNode, base: string) {
    this.node = node;
    this.base = base;
  }

  public decodeTrack(encodedTrack: string): Promise<Track> {
    const url = this.url("decodetrack");
    url.searchParams.append("encodedTrack", encodedTrack);
    return this.request(RequestType.GET, url);
  }

  public decodeTracks(encodedTracks: string[]): Promise<Track[]> {
    const url = this.url("decodetracks");
    return this.request(
      RequestType.POST,
      url,
      Buffer.from(JSON.stringify(encodedTracks)),
    );
  }

  public getVersion(): Promise<string> {
    const url = this.url("/version");
    return this.request(RequestType.GET, url);
  }

  public loadTracks(identifier: string): Promise<TrackResponse> {
    const url = this.url("loadtracks");
    url.searchParams.append("identifier", identifier);
    return this.request(RequestType.GET, url);
  }

  public async destroyPlayer(guildId: string): Promise<void> {
    const uri = `sessions/${this.node.sessionId}/players/${guildId}`;
    const url = this.node.rest.url(uri);
    await this.request(RequestType.DELETE, url);
  }

  public async request<T = any>(
    method: RequestType,
    url: URL,
    data?: Buffer,
  ): Promise<T> {
    const message = await new Promise<IncomingMessage>((resolve) => {
      const req = request(
        {
          headers: {
            Accept: "application/json",
            Authorization: this.node.password,
            "Content-Type": "application/json",
          },
          hostname: url.hostname,
          method,
          path: url.pathname + url.search,
          port: url.port,
          protocol: url.protocol,
        },
        resolve,
      );

      if (data) {
        req.write(data);
      }

      req.end();
    });

    if (message.statusCode && ![200, 204].includes(message.statusCode)) {
      throw new HTTPError(message, method, url);
    }

    const chunks: Buffer[] = [];
    message.on("data", (chunk) => {
      if (typeof chunk === "string") {
        chunk = Buffer.from(chunk);
      }
      chunks.push(chunk);
    });

    return new Promise<T>((resolve, reject) => {
      message.once("error", reject);
      message.once("end", () => {
        message.removeAllListeners();
        const dataX = Buffer.concat(chunks);

        try {
          resolve(JSON.parse(dataX.toString()) as T);
        } catch (e) {
          resolve(dataX.toString() as T);
        }
      });
    });
  }

  public routeStatus(): Promise<RoutePlannerStatus> {
    const url = this.url("routeplanner/status");
    return this.request(RequestType.GET, url);
  }

  public routeFree(address: string): Promise<void> {
    const url = this.url("routeplanner/free/address");
    return this.request(
      RequestType.POST,
      url,
      Buffer.from(JSON.stringify({ address })),
    );
  }

  public routeFreeAll(): Promise<void> {
    const url = this.url("routeplanner/free/all");
    return this.request(RequestType.POST, url);
  }

  public updatePlayer(
    guildId: string,
    payload: UpdatePlayer,
  ): Promise<GetPlayer> {
    const uri = `sessions/${this.node.sessionId}/players/${guildId}`;
    const url = this.node.rest.url(uri);
    return this.request(
      RequestType.PATCH,
      url,
      Buffer.from(JSON.stringify(payload)),
    );
  }

  public url(input: string): URL {
    return new URL(input, this.base);
  }
}
