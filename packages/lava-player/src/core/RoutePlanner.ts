/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { RoutePlannerStatus } from "../types/index.js";
import type { Http } from "./Http.js";

export default class RoutePlanner {
  constructor(public readonly http: Http) {}

  public status(): Promise<RoutePlannerStatus> {
    const url = this.http.url("routeplanner/status");
    return this.http.do("get", url);
  }

  public unMark(address?: string): Promise<void> {
    if (address) {
      const url = this.http.url("routeplanner/free/address");
      return this.http.do(
        "post",
        url,
        Buffer.from(JSON.stringify({ address })),
      );
    }

    const url = this.http.url("routeplanner/free/all");
    return this.http.do("post", url);
  }
}
