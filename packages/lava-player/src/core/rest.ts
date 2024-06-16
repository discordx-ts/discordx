/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { BaseNode } from "../base/base-node.js";
import type {
  GetPlayer,
  RoutePlannerStatus,
  Track,
  TrackResponse,
  UpdatePlayer,
} from "../types/index.js";
import { RequestType } from "../types/index.js";
import { HttpClient } from "./http.js";

export class Rest {
  public readonly node: BaseNode;
  public http: HttpClient;

  constructor(node: BaseNode, base: string) {
    this.node = node;
    this.http = new HttpClient(base, node.password);
  }

  public decodeTrack(encodedTrack: string): Promise<Track> {
    const url = this.http.url("decodetrack");
    url.searchParams.append("encodedTrack", encodedTrack);
    return this.http.request(RequestType.GET, url);
  }

  public decodeTracks(encodedTracks: string[]): Promise<Track[]> {
    const url = this.http.url("decodetracks");
    return this.http.request(
      RequestType.POST,
      url,
      Buffer.from(JSON.stringify(encodedTracks)),
    );
  }

  public getVersion(): Promise<string> {
    const url = this.http.url("/version");
    return this.http.request(RequestType.GET, url);
  }

  public loadTracks(identifier: string): Promise<TrackResponse> {
    const url = this.http.url("loadtracks");
    url.searchParams.append("identifier", identifier);
    return this.http.request(RequestType.GET, url);
  }

  public async destroyPlayer(guildId: string): Promise<void> {
    const uri = `sessions/${this.node.sessionId}/players/${guildId}`;
    const url = this.http.url(uri);
    await this.http.request(RequestType.DELETE, url);
  }

  public routeStatus(): Promise<RoutePlannerStatus> {
    const url = this.http.url("routeplanner/status");
    return this.http.request(RequestType.GET, url);
  }

  public routeFree(address: string): Promise<void> {
    const url = this.http.url("routeplanner/free/address");
    return this.http.request(
      RequestType.POST,
      url,
      Buffer.from(JSON.stringify({ address })),
    );
  }

  public routeFreeAll(): Promise<void> {
    const url = this.http.url("routeplanner/free/all");
    return this.http.request(RequestType.POST, url);
  }

  public updatePlayer(
    guildId: string,
    payload: UpdatePlayer,
  ): Promise<GetPlayer> {
    const uri = `sessions/${this.node.sessionId}/players/${guildId}`;
    const url = this.http.url(uri);
    return this.http.request(
      RequestType.PATCH,
      url,
      Buffer.from(JSON.stringify(payload)),
    );
  }
}
