import Http from "./Http.js";
import { RoutePlannerStatus } from "../types/index.js";

export default class RoutePlanner {
  constructor(public readonly http: Http) {}

  public status(): Promise<RoutePlannerStatus> {
    const url = this.http.url();
    url.pathname = "/routeplanner/status";
    return this.http.do("get", url);
  }

  public unmark(address?: string): Promise<void> {
    const url = this.http.url();
    if (address) {
      url.pathname = "/routeplanner/free/address";
      return this.http.do(
        "post",
        url,
        Buffer.from(JSON.stringify({ address }))
      );
    }

    url.pathname = "/routeplanner/free/all";
    return this.http.do("post", url);
  }
}
