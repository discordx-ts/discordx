import { Decorator } from "@discordx/internal";

import type { DRouter, Koa } from "../../index.js";

export abstract class Method extends Decorator {
  protected _router!: DRouter;

  get router(): DRouter {
    return this._router;
  }
  set router(value: DRouter) {
    this._router = value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler(koa: Koa): any {
    return (...params: unknown[]) => {
      return this._method?.bind(this._router.instance)(...params, koa);
    };
  }
}
