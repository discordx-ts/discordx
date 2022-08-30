import { Decorator } from "@discordx/internal";
import type { Socket } from "socket.io";

import type { Server } from "../../index.js";

export type Next = (...paramsToNext: unknown[]) => Promise<unknown>;

export type GuardFunction<Type = any> = (
  params: Type,
  server: Server,
  socket: Socket,
  next: Next
) => any;

/**
 * @category Decorator
 */
export class DGuard extends Decorator {
  protected _fn: GuardFunction;

  get fn(): GuardFunction {
    return this._fn;
  }

  protected constructor(fn: GuardFunction) {
    super();
    this._fn = fn;
  }

  static create(fn: GuardFunction): DGuard {
    return new DGuard(fn);
  }
}
