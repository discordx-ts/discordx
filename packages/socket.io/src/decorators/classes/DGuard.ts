import { Decorator } from "@discordx/internal";
import { Server } from "../../index.js";
import { Socket } from "socket.io";

export type Next = (...paramsToNext: unknown[]) => Promise<unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GuardFunction<Type = any> = (
  params: Type,
  server: Server,
  socket: Socket,
  next: Next
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
