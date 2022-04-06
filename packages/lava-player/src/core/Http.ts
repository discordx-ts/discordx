/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IncomingHttpHeaders, IncomingMessage } from "http";
import { request, STATUS_CODES } from "http";
import { URL } from "url";

import type { BaseNode } from "../base/Node.js";
import type { Track, TrackInfo, TrackResponse } from "../types/index.js";
import RoutePlanner from "./RoutePlanner.js";

export class HTTPError extends Error {
  public method: string;
  public statusCode: number;
  public headers: IncomingHttpHeaders;
  public path: string;

  get statusMessage(): string | undefined {
    return STATUS_CODES[this.statusCode];
  }

  constructor(httpMessage: IncomingMessage, method: string, url: URL) {
    super(
      `${httpMessage.statusCode} ${
        STATUS_CODES[httpMessage.statusCode as number]
      }`
    );

    this.statusCode = httpMessage.statusCode as number;
    this.headers = httpMessage.headers;
    this.name = this.constructor.name;
    this.path = url.toString();
    this.method = method;
  }
}

export class Http {
  public readonly node: BaseNode;
  public input: string;
  public base?: string;
  public routePlanner: RoutePlanner = new RoutePlanner(this);

  constructor(node: BaseNode, input: string, base?: string) {
    this.node = node;
    this.input = input;
    this.base = base;
  }

  public url(): URL {
    return new URL(this.input, this.base);
  }

  public load(identifier: string): Promise<TrackResponse> {
    const url = this.url();
    url.pathname = "/loadtracks";
    url.searchParams.append("identifier", identifier);

    return this.do("GET", url);
  }

  public decode(track: string): Promise<TrackInfo>;
  public decode(tracks: string[]): Promise<Track[]>;
  public decode(tracks: string | string[]): Promise<TrackInfo | Track[]>;
  public decode(tracks: string | string[]): Promise<TrackInfo | Track[]> {
    const url = this.url();
    if (Array.isArray(tracks)) {
      url.pathname = "/decodetracks";
      return this.do("POST", url, Buffer.from(JSON.stringify(tracks)));
    } else {
      url.pathname = "/decodetrack";
      url.searchParams.append("track", tracks);
      return this.do("GET", url);
    }
  }

  public async do<T = any>(
    method: string,
    url: URL,
    data?: Buffer
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
        resolve
      );

      if (data) {
        req.write(data);
      }

      req.end();
    });

    if (
      message.statusCode &&
      message.statusCode >= 200 &&
      message.statusCode < 300
    ) {
      const chunks: Array<Buffer> = [];
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

          try {
            const dataX = Buffer.concat(chunks);
            resolve(JSON.parse(dataX.toString()));
          } catch (e) {
            reject(e);
          }
        });
      });
    }

    throw new HTTPError(message, method, url);
  }
}
