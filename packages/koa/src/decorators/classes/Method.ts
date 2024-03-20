/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
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

  handler(koa: Koa): any {
    return (...params: unknown[]) => {
      return this._method?.bind(this._router.instance)(...params, koa);
    };
  }
}
