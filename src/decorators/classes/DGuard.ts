import { Decorator } from "./Decorator";
import { GuardFunction } from "../..";

export class DGuard extends Decorator {
  protected _fn: GuardFunction;

  get fn() {
    return this._fn;
  }

  protected constructor(fn: GuardFunction) {
    super();
    this._fn = fn;
  }

  static create(fn: GuardFunction) {
    return new DGuard(fn);
  }
}
